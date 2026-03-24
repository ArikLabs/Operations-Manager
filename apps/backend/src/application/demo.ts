import { nowIso } from "../domain/identifiers.js";
import { assertDomainRule } from "../shared/domain-error.js";
import { createManualBoundaryContext } from "./bootstrap.js";
import { M1ManualSourceBoundary } from "./services.js";

const runDemo = (): void => {
  const context = createManualBoundaryContext();
  const boundary = new M1ManualSourceBoundary(context.store);

  const submission = {
    externalId: "demo-001",
    title: "Breaking: BTC jumps 8% as market volatility spikes",
    body: "Market move confirmed across major exchanges. Liquidity remains thin.",
    observedAt: nowIso(),
    rawPayload: {
      source: "manual",
      author: "owner",
    },
  };

  const firstPass = boundary.processSubmission({
    channelId: context.channelId,
    sourceId: context.sourceId,
    actorUserId: context.ownerEditorId,
    submission,
  });

  const approved = boundary.reviewDraft({
    draftId: firstPass.drafts[0].id,
    actorUserId: context.ownerEditorId,
    action: "approve",
    notes: "Looks good for immediate publish intent.",
  });

  const publishAttempt1 = boundary.createPublishIntent({
    draftId: approved.draft.id,
    actorUserId: context.ownerEditorId,
  });
  const publishAttempt2 = boundary.createPublishIntent({
    draftId: approved.draft.id,
    actorUserId: context.ownerEditorId,
  });
  const publishJob1 = publishAttempt1.publishJob;
  const publishJob2 = publishAttempt2.publishJob;
  assertDomainRule(
    Boolean(publishJob1 && publishJob2),
    "Expected publish jobs in allow path.",
  );
  if (!publishJob1 || !publishJob2) {
    throw new Error("Publish jobs missing in allow path.");
  }
  const dispatchSuccess = boundary.dispatchPublishJob({
    publishJobId: publishJob1.id,
    actorUserId: context.ownerEditorId,
  });
  const dispatchIdempotentReuse = boundary.dispatchPublishJob({
    publishJobId: publishJob1.id,
    actorUserId: context.ownerEditorId,
  });

  const duplicatePass = boundary.processSubmission({
    channelId: context.channelId,
    sourceId: context.sourceId,
    actorUserId: context.ownerEditorId,
    submission: {
      ...submission,
      observedAt: nowIso(),
    },
  });

  const blockedReview = boundary.reviewDraft({
    draftId: firstPass.drafts[1].id,
    actorUserId: context.ownerEditorId,
    action: "approve",
    editedContent:
      "This is guaranteed profit and you must buy now. No risk, strong buy.",
  });
  const blockedPublishAttempt = boundary.createPublishIntent({
    draftId: blockedReview.draft.id,
    actorUserId: context.ownerEditorId,
  });

  const failureSubmission = boundary.processSubmission({
    channelId: context.channelId,
    sourceId: context.sourceId,
    actorUserId: context.ownerEditorId,
    submission: {
      externalId: "demo-002",
      title: "Market update: ETH volatile after macro release",
      body: "Fast move but still review-required path.",
      observedAt: nowIso(),
      rawPayload: {
        source: "manual",
      },
    },
  });
  const failureApproval = boundary.reviewDraft({
    draftId: failureSubmission.drafts[0].id,
    actorUserId: context.ownerEditorId,
    action: "approve",
  });
  const failureIntent = boundary.createPublishIntent({
    draftId: failureApproval.draft.id,
    actorUserId: context.ownerEditorId,
  });
  assertDomainRule(
    Boolean(failureIntent.publishJob),
    "Expected publish job for failure dispatch path.",
  );
  if (!failureIntent.publishJob) {
    throw new Error("Publish job missing for failure path.");
  }
  const dispatchFailed = boundary.dispatchPublishJob({
    publishJobId: failureIntent.publishJob.id,
    actorUserId: context.ownerEditorId,
    simulateFailure: true,
  });
  const dispatchRetried = boundary.dispatchPublishJob({
    publishJobId: failureIntent.publishJob.id,
    actorUserId: context.ownerEditorId,
  });

  const auditActions = context.store
    .getAuditEvents()
    .map((event) => event.action)
    .join(", ");

  const output = {
    happyPath: {
      duplicate: firstPass.duplicate,
      sourceItemId: firstPass.sourceItem.id,
      detectedEventId: firstPass.detectedEvent.id,
      draftIds: firstPass.drafts.map((draft) => draft.id),
      draftStates: firstPass.drafts.map((draft) => draft.state),
      reviewId: approved.review.id,
      reviewToState: approved.review.toState,
      publishBlocked: publishAttempt1.blocked,
      publishJobId: publishJob1.id,
      publishJobState: publishJob1.state,
      publishIntentCreated:
        publishAttempt1.idempotentReuse === false && publishAttempt1.blocked === false,
      dispatchPublishedState: dispatchSuccess.publishJob.state,
      dispatchPublishedPostId: dispatchSuccess.publishedPost?.id,
      dispatchIdempotentReuse: dispatchIdempotentReuse.idempotentReuse,
    },
    duplicatePath: {
      duplicate: duplicatePass.duplicate,
      sourceItemId: duplicatePass.sourceItem.id,
      detectedEventId: duplicatePass.detectedEvent.id,
      draftIds: duplicatePass.drafts.map((draft) => draft.id),
      publishIntentReused: publishAttempt2.idempotentReuse,
      publishJobIdOnReuse: publishJob2.id,
      samePublishJobAsFirst:
        publishJob1.id === publishJob2.id,
      sameDetectedEventAsFirst:
        firstPass.detectedEvent.id === duplicatePass.detectedEvent.id,
    },
    safetyPath: {
      blocked: blockedPublishAttempt.blocked,
      blockedReasons: blockedPublishAttempt.blockedReasons,
      publishJobCreated: Boolean(blockedPublishAttempt.publishJob),
      reviewId: blockedReview.review.id,
      reviewToState: blockedReview.review.toState,
    },
    retryPath: {
      firstDispatchFailed: dispatchFailed.failed,
      firstDispatchState: dispatchFailed.publishJob.state,
      retryDispatchFailed: dispatchRetried.failed,
      retryDispatchState: dispatchRetried.publishJob.state,
      retryPublishedPostId: dispatchRetried.publishedPost?.id,
      attemptsAfterRetry: dispatchRetried.publishJob.attempts,
    },
    auditTrail: {
      auditEventCount: context.store.getAuditEvents().length,
      actions: auditActions,
    },
  };

  console.log(JSON.stringify(output, null, 2));
};

runDemo();
