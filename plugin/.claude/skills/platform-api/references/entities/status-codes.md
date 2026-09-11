# Status codes

Generated from the platform's OpenAPI document. Do not edit by hand — the next refresh overwrites it.

Status is an integer, and the same integer means different things on different entities. Read the table for the entity you are querying, never the one next to it.

These are the codes the model declares. A few that the written guides describe are not in the model at all — see `references/conventions.md` for those.

## AltinnSigning

| Code | Name |
| --- | --- |
| 43001 | NotSigned |
| 43002 | PartialSigned |
| 43003 | Signed |
| 43004 | AlreadySigned |
| 43005 | Failed |

## AmeldingData

| Code | Name |
| --- | --- |
| 0 | IN_PROGRESS |
| 1 | GENERATED |
| 2 | SENT |
| 3 | STATUS_FROM_ALTINN_RECEIVED |
| 4 | AMELDING_TOO_LARGE |
| 5 | UPLOADED_TO_ALTINN |
| 6 | READY_TO_SEND |

## AnnualSettlement

| Code | Name |
| --- | --- |
| 36100 | Created |
| 36105 | Prepared |
| 36110 | Finalized |
| 36115 | PostedClosingEntries |
| 36120 | SentTaxReport |
| 36122 | SentAnnualAccount |
| 36125 | Completed |

## ApiKey

| Code | Name |
| --- | --- |
| 80000 | Active |
| 80010 | InProgress |
| 80020 | WaitingForApproval |
| 80030 | Approved |
| 80040 | Denied |
| 80050 | InActive |

## Approval

| Code | Name |
| --- | --- |
| 50120 | Active |
| 50130 | Approved |
| 50140 | Rejected |
| 50150 | Reassigned |
| 50160 | IndirectlyApproved |
| 50170 | PreviouslyApproved |

## Asset

| Code | Name |
| --- | --- |
| 46200 | Active |
| 46205 | Sold |
| 46210 | Depreciated |
| 46215 | Lost |
| 46220 | DepreciationFailed |

## BankIntegrationAgreement

| Code | Name |
| --- | --- |
| 700001 | Pending |
| 700002 | WaitForSigning |
| 700003 | WaitForBankApprove |
| 700004 | WaitForZDataApprove |
| 700005 | Active |
| 700006 | Canceled |

## BankStatement

| Code | Name |
| --- | --- |
| 48001 | Draft |
| 48002 | Completed |

## Budget

| Code | Name |
| --- | --- |
| 47001 | Draft |
| 47002 | Active |

## Contract

| Code | Name |
| --- | --- |
| 120000 | Draft |
| 120001 | Deploy |
| 120002 | Running |
| 120003 | Killed |

## ContractParameter

| Code | Name |
| --- | --- |
| 121001 | Deploy |
| 121002 | Run |

## ContractRunLog

| Code | Name |
| --- | --- |
| 120100 | Started |
| 120101 | Completed |
| 120102 | Failed |

## CustomField

| Code | Name |
| --- | --- |
| 110100 | Draft |
| 110101 | Active |

## CustomerInvoice

| Code | Name |
| --- | --- |
| 42001 | Draft |
| 42002 | Invoiced |
| 42003 | PartlyPaid |
| 42004 | Paid |
| 42005 | Sold |
| 42006 | Credited |
| 42007 | PartlyCredited |
| 42008 | WaitingForOffer |
| 42009 | OfferAccepted |
| 42010 | OfferReceived |
| 42011 | OfferRequestRejected |

## CustomerInvoiceItem

| Code | Name |
| --- | --- |
| 41301 | Draft |
| 41302 | Invoiced |

## CustomerInvoiceReminder

| Code | Name |
| --- | --- |
| 42101 | Registered |
| 42102 | Sent |
| 42103 | Paid |
| 42104 | Completed |
| 42105 | Failed |
| 42106 | SentToDebtCollection |
| 42107 | QueuedForDebtCollection |
| 42108 | NotActiveButUnComplete |

## CustomerOrder

| Code | Name |
| --- | --- |
| 41001 | Draft |
| 41002 | Registered |
| 41003 | PartlyTransferredToInvoice |
| 41004 | TransferredToInvoice |
| 41005 | Completed |

## CustomerOrderItem

| Code | Name |
| --- | --- |
| 41101 | Draft |
| 41102 | Registered |
| 41103 | TransferredToInvoice |
| 41104 | Completed |

## CustomerQuote

| Code | Name |
| --- | --- |
| 40101 | Draft |
| 40102 | Registered |
| 40103 | ShippedToCustomer |
| 40104 | CustomerAccepted |
| 40105 | TransferredToOrder |
| 40106 | TransferredToInvoice |
| 40107 | Completed |

## DistributionPlan

| Code | Name |
| --- | --- |
| 46001 | Active |
| 46002 | Inactive |

## EHFLog

| Code | Name |
| --- | --- |
| 70000 | Pending |
| 70001 | InProgress |
| 70002 | Failed |
| 70003 | Completed |
| 70004 | Cancelled |

## EmailLog

| Code | Name |
| --- | --- |
| 70000 | Pending |
| 70001 | InProgress |
| 70002 | Failed |
| 70003 | Completed |
| 70004 | Cancelled |

## ExternalOffer

| Code | Name |
| --- | --- |
| 2000 | Received |
| 2010 | Accepted |
| 2020 | Rejected |
| 2030 | SystemRejected |
| 2040 | Sold |
| 2050 | Expired |
| 2060 | CreditNoteRaised |

## FinancialReportComment

| Code | Name |
| --- | --- |
| 10 | Draft |
| 20 | Published |
| 30 | Archived |

## IncomeReportData

| Code | Name |
| --- | --- |
| 49001 | Created |
| 49002 | Sent |
| 49003 | Rejected |
| 49004 | Deleted |
| 49005 | Approved |
| 49006 | InquiryActive |
| 49007 | InquiryAnswered |
| 49008 | InquiryRejected |
| 49009 | IncomeReportReceived |
| 49010 | IncomeReportApproved |
| 49011 | IncomeReportRejected |

## IncomeReportInquiry

| Code | Name |
| --- | --- |
| 49001 | Created |
| 49002 | Sent |
| 49003 | Rejected |
| 49004 | Deleted |
| 49005 | Approved |
| 49006 | InquiryActive |
| 49007 | InquiryAnswered |
| 49008 | InquiryRejected |
| 49009 | IncomeReportReceived |
| 49010 | IncomeReportApproved |
| 49011 | IncomeReportRejected |

## JournalEntryLine

| Code | Name |
| --- | --- |
| 31001 | Open |
| 31002 | PartlyMarked |
| 31003 | Marked |
| 31004 | Credited |

## JournalEntryLineDraft

| Code | Name |
| --- | --- |
| 34001 | Journaled |
| 34002 | Credited |

## Notification

| Code | Name |
| --- | --- |
| 900010 | New |
| 900020 | Read |
| 900030 | Marked |

## Payment

| Code | Name |
| --- | --- |
| 44000 | Unknown |
| 44001 | Created |
| 44002 | TransferredToBank |
| 44003 | RejectedByBank |
| 44004 | Completed |
| 44005 | PaymentFileGenerated |
| 44006 | Paid |
| 44007 | SentToHub |
| 44008 | InPaymentQueue |
| 44009 | WaitingForBankStatus |
| 44010 | RejectedByHub |
| 44011 | ManualTransfer |
| 44012 | Rejected |
| 44013 | TransferToHubFailed |
| 44014 | Canceled |
| 44015 | ForApproval |
| 44016 | Approved |
| 44017 | RejectedByApprover |
| 44018 | JournaledWithoutMatch |
| 44019 | CancellationRequest |
| 44020 | Ignored |
| 44021 | TimedOut2FA |
| 44022 | TransferredAvtaleGiro |
| 44023 | AcceppetedAvtaleGiro |
| 44024 | RejectedAvtaleGiro |
| 44025 | SendingToHub |
| 44026 | TransferredByHub |
| 44027 | BulkProccessing |
| 44028 | Reverted |
| 44029 | CompletedManually |

## PaymentBatch

| Code | Name |
| --- | --- |
| 45000 | Ignore |
| 45001 | Pending |
| 45002 | PaymentFileGenerated |
| 45003 | PaymentFileTransferredBank |
| 45004 | ReceiptReceived |
| 45005 | ReceiptParsed |
| 45006 | Rejected |
| 45007 | ReceiptIsIncomplete |
| 45008 | PartlyCompleted |
| 45009 | Completed |
| 45010 | PaymentFileInTransitToBank |
| 45011 | ForApproval |
| 45012 | Approved |
| 45013 | RejectedByApprover |
| 45014 | TransferError |
| 45015 | JournalError |
| 45016 | Canceled |
| 45017 | Reverted |

## PaymentInfoType

| Code | Name |
| --- | --- |
| 42400 | Active |
| 42401 | Disabled |

## PeriodSumGroup

| Code | Name |
| --- | --- |
| 47101 | Updated |
| 47102 | Updating |
| 47103 | NeedsUpdate |

## PostPost

| Code | Name |
| --- | --- |
| 46001 | Locked |

## Product

| Code | Name |
| --- | --- |
| 35001 | Active |
| 35002 | Discarded |
| 35003 | Deleted |

## Project

| Code | Name |
| --- | --- |
| 42201 | Registered |
| 42202 | OfferPhase |
| 42203 | InProgress |
| 42204 | Completed |
| 42205 | Discarded |

## ProjectTask

| Code | Name |
| --- | --- |
| 42301 | Registered |
| 42302 | Active |
| 42303 | Completed |

## ReInvoice

| Code | Name |
| --- | --- |
| 30201 | Marked |
| 30202 | Ready |
| 30203 | ReInvoiced |
| 30204 | PartlyReinvoiced |

## Reconcile

| Code | Name |
| --- | --- |
| 30201 | Marked |
| 30202 | Ready |
| 30203 | ReInvoiced |
| 30204 | PartlyReinvoiced |

## RecurringInvoice

| Code | Name |
| --- | --- |
| 46001 | InActive |
| 46002 | Active |

## RecurringInvoiceLog

| Code | Name |
| --- | --- |
| 46101 | Draft |
| 46102 | InProgress |
| 46103 | Failed |
| 46104 | Completed |

## ShareholderRegisterStatement

| Code | Name |
| --- | --- |
| 36100 | Created |
| 36105 | Prepared |
| 36110 | Finalized |
| 36122 | Sent |
| 36125 | Completed |

## Sharing

| Code | Name |
| --- | --- |
| 70000 | Pending |
| 70001 | InProgress |
| 70002 | Failed |
| 70003 | Completed |
| 70004 | Cancelled |

## SigningBasket

| Code | Name |
| --- | --- |
| 51000 | Draft |
| 51001 | Pending |
| 51002 | Opened |
| 51003 | Expired |
| 51004 | Completed |
| 51010 | InvalidReturnUrl |
| 51011 | InvalidScaMethod |

## SupplierInvoice

| Code | Name |
| --- | --- |
| 30101 | Draft |
| 30102 | ForApproval |
| 30103 | Approved |
| 30104 | Journaled |
| 30108 | Rejected |

## Task

| Code | Name |
| --- | --- |
| 50020 | Active |
| 50030 | Complete |
| 50040 | Pending |
| 50050 | Cancelled |

## VatReport

| Code | Name |
| --- | --- |
| 32001 | Executed |
| 32002 | Submitted |
| 32003 | Rejected |
| 32004 | Approved |
| 32005 | Adjusted |
| 32006 | Cancelled |
| 32050 | Created |
| 32055 | Prepared |
| 32060 | Controlled |
| 32065 | RejectedNew |
| 32070 | Sent |
| 32075 | Completed |
| 32080 | Paid |
| 32085 | CancelledNew |

## WorkItemGroup

| Code | Name |
| --- | --- |
| 60001 | Draft |
| 60005 | AwaitingApproval |
| 60009 | Declined |
| 60010 | Approved |
| 60020 | PartlyPaid |
| 60021 | Paid |
