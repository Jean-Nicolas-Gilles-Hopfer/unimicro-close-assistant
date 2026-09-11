# Company and shared

Generated from the platform's OpenAPI document. Do not edit by hand — the next refresh overwrites it.

Field names are exact. A name that is not listed does not exist, however plausible it sounds — a query that filters on one returns unfiltered rows rather than an error.

These tables serve the statistics endpoint as well as the business API: the field names are what its `select`, `filter` and `orderby` accept, and the relation names are a starting point for its `expand`, which also takes a related model's own name. See the statistics reference for the query syntax they go into.

## CompanySettings — `companysettings`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `APActivated` | boolean |  |
| `APContactID` | integer (int32) |  |
| `APGuid` | string |  |
| `APIncludeAttachment` | boolean |  |
| `AcceptableDelta4CustomerPayment` | number (double) | Delta value that is acceptable between customer invoice and payment |
| `AcceptableDelta4CustomerPaymentAccountID` | integer (int32) | Account for acceptable delta between customer invoice and payment |
| `AccountGroupSetID` | integer (int32) |  |
| `AccountVisibilityGroupID` | integer (int32) |  |
| `AccountingLockedDate` | string (date) |  |
| `AgioGainAccountID` | integer (int32) |  |
| `AgioLossAccountID` | integer (int32) |  |
| `AllowAvtalegiroRegularInvoice` | boolean |  |
| `AutoDistributeInvoice` | boolean |  |
| `AutoJournalPayment` | string |  |
| `BankChargeAccountID` | integer (int32) |  |
| `BaseCurrencyCodeID` | integer (int32) |  |
| `BatchInvoiceMinAmount` | number (double) |  |
| `BookCustomerInvoiceOnDeliveryDate` | boolean |  |
| `CompanyBankAccountID` | integer (int32) |  |
| `CompanyName` | string | max 255 |
| `CompanyRegistered` | boolean |  |
| `CompanyTypeID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CustomerAccountID` | integer (int32) |  |
| `CustomerCreditDays` | integer (int32) |  |
| `CustomerInvoiceReminderSettingsID` | integer (int32) |  |
| `DefaultAccrualAccountID` | integer (int32) |  |
| `DefaultAddressID` | integer (int32) |  |
| `DefaultCustomerInvoiceReminderReportID` | integer (int32) |  |
| `DefaultCustomerInvoiceReportID` | integer (int32) |  |
| `DefaultCustomerOrderReportID` | integer (int32) |  |
| `DefaultCustomerQuoteReportID` | integer (int32) |  |
| `DefaultDistributionsID` | integer (int32) |  |
| `DefaultEmailID` | integer (int32) |  |
| `DefaultPhoneID` | integer (int32) |  |
| `DefaultSalesAccountID` | integer (int32) |  |
| `DefaultTOFCurrencySettingsID` | integer (int32) |  |
| `DefaultVatTypeAccountsID` | integer (int32) |  |
| `Deleted` | boolean |  |
| `EnableAdvancedJournalEntry` | boolean |  |
| `EnableApprovalFlow` | boolean |  |
| `EnableArchiveSupplierInvoice` | boolean |  |
| `EnableCheckboxesForSupplierInvoiceList` | boolean |  |
| `EnableSendPaymentBeforeJournaled` | boolean |  |
| `Factoring` | integer (int32) |  |
| `FactoringEmailID` | integer (int32) |  |
| `FactoringNumber` | integer (int32) |  |
| `FactoringSettingsID` | integer (int32) |  |
| `ForceSupplierInvoiceApproval` | boolean |  |
| `GLN` | string | max 13 |
| `HasAutobank` | boolean | Do the company have an autobank agreement |
| `HideInActiveCustomers` | boolean |  |
| `HideInActiveSuppliers` | boolean |  |
| `ID` | integer (int32) |  |
| `IgnorePaymentsWithoutEndToEndID` | boolean |  |
| `InterrimPaymentAccountID` | integer (int32) |  |
| `InterrimRemitAccountID` | integer (int32) |  |
| `InvoiceToJournalEntry` | integer (int32) | 0 = Dimension, 1 = ItemSourceDimension |
| `Localization` | string | max 10 |
| `LogoAlign` | integer (int32) |  |
| `LogoFileID` | integer (int32) |  |
| `LogoHideField` | integer (int32) |  |
| `MergeAttachments` | boolean |  |
| `NetsIntegrationActivated` | boolean |  |
| `OfficeMunicipalityNo` | string | max 255 |
| `OnlyJournalMatchedPayments` | boolean |  |
| `OrganizationNumber` | string | max 100 |
| `OverrideSortIndex` | boolean |  |
| `PaymentBankAgreementNumber` | string | max 255 |
| `PaymentBankIdentification` | string | max 255 |
| `PeriodSeriesAccountID` | integer (int32) |  |
| `PeriodSeriesVatID` | integer (int32) |  |
| `PersonNumber` | string | max 20 |
| `PresetCustomerInvoiceNumber` | boolean |  |
| `RoundingNumberOfDecimals` | integer (int32) | Number of decimals used when rounding lines |
| `RoundingType` | integer (int32) | Which method to use when rounding; 0 = Up, 1 = Down, 2 = Integer, 3 = Half |
| `SAFTimportAccountID` | integer (int32) |  |
| `SalaryBankAccountID` | integer (int32) |  |
| `SaveCustomersFromQuoteAsLead` | boolean |  |
| `SettlementVatAccountID` | integer (int32) |  |
| `ShowAccountVatTypeLinksOnProducts` | boolean |  |
| `ShowKIDOnCustomerInvoice` | boolean |  |
| `ShowNumberOfDecimals` | integer (int32) | Number of decimals to show for amount and price |
| `SplitAssetsByDimensions` | boolean |  |
| `StatusCode` | integer (int32) |  |
| `StoreDistributedInvoice` | boolean |  |
| `SupplierAccountID` | integer (int32) |  |
| `TaxBankAccountID` | integer (int32) |  |
| `TaxMandatory` | boolean |  |
| `TaxMandatoryType` | integer (int32) |  |
| `TaxableFromDate` | string (date) |  |
| `TaxableFromLimit` | number (double) |  |
| `TwoStageAutobankEnabled` | boolean | Have the company enabled two stage authorization on autobank payments |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UseAssetRegister` | boolean | Does the company register Assets (Eiendeler) |
| `UseFactoring` | boolean |  |
| `UseFinancialDateToCalculateVatPercent` | boolean |  |
| `UseNetsIntegration` | boolean |  |
| `UseOcrInterpretation` | boolean | Field used to indicate if the client has accepted the agreement to use OCR interpretation. By purpose left as nullable, to make it easy to check if user has either not decided (null), accepted (true) or rejected (false) |
| `UsePaymentBankValues` | boolean |  |
| `UseStandardDimOnAccount` | boolean |  |
| `UseXtraPaymentOrgXmlTag` | boolean |  |
| `VatLockedDate` | string (date) |  |
| `VatReportFormID` | integer (int32) |  |
| `WebAddress` | string | max 255 |
| `XtraPaymentOrgXmlTagValue` | string | max 256 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `APContact` | Contact |
| `APIncomming` | AccessPointFormat[] |
| `APOutgoing` | AccessPointFormat[] |
| `BankAccounts` | BankAccount[] |
| `CompanyBankAccount` | BankAccount |
| `CustomValues` | CustomValues |
| `CustomerInvoiceReminderSettings` | CustomerInvoiceReminderSettings |
| `DefaultAddress` | Address |
| `DefaultEmail` | Email |
| `DefaultPhone` | Phone |
| `DefaultTOFCurrencySettings` | TOFCurrencySettings |
| `DefaultVatTypeAccounts` | AccountVatType |
| `Distributions` | Distributions |
| `FactoringEmail` | Email |
| `FactoringSettings` | FactoringSettings |
| `SAFTimportAccount` | Account |
| `SalaryBankAccount` | BankAccount |
| `TaxBankAccount` | BankAccount |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| POST | `companysettings/{id}?action=accept-ocr-agreement` |  |
| PUT | `companysettings/{id}?action=activate-10decimalsOnInvoiceCalculation` |  |
| PUT | `companysettings/{id}?action=activate-einvoice` |  |
| GET | `companysettings/{id}?action=audit` | query (required) |
| GET | `companysettings?action=audit` | query (required) |
| POST | `companysettings?action=change-period-series` | periodSeriesID (required), accountYear (required) |
| PUT | `companysettings/{id}?action=deactivate-einvoice` |  |
| GET | `companysettings?action=exists` |  |
| GET | `companysettings?action=fill-in-from-brreg` | orgNumber (required) |
| PUT | `companysettings?action=preset-customerInvoiceNumber` |  |
| POST | `companysettings/{id}?action=reject-ocr-agreement` |  |
| PUT | `companysettings?action=tax-mandatory-change` | updateAccounts, updateProducts |
| POST | `companysettings/{id}?action=update-logo` | logoFileId (required) |
| POST | `companysettings/{id}?action=update-report-logo` | logoFileId (required) |

## User — `users`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `BankIntegrationUserName` | string | max 255 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `DisplayName` | string | max 255 |
| `Email` | string | max 255 |
| `GlobalIdentity` | string |  |
| `HasAgreedToImportDisclaimer` | boolean |  |
| `ID` | integer (int32) |  |
| `IsAutobankAdmin` | boolean |  |
| `LastLogin` | string (date-time) |  |
| `PhoneNumber` | string | max 255 |
| `Protected` | boolean |  |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UserName` | string | max 255 |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `users?action=2fa-details` |  |
| POST | `users?action=accept-CustomerAgreement` |  |
| POST | `users?action=accept-UserLicenseAgreement` |  |
| POST | `users/{id}?action=activate` |  |
| POST | `users?action=add-user` | globalIdentity (required), supportuser |
| GET | `users?action=adminusers` |  |
| GET | `users?action=audit` | query (required) |
| GET | `users/{id}?action=audit` | query (required) |
| GET | `users?action=bankid-verification` |  |
| GET | `users?action=bankid-verified` |  |
| PUT | `users?action=change-autobank-password` |  |
| GET | `users?action=current-roles` |  |
| GET | `users?action=current-session` |  |
| POST | `users/{id}?action=inactivate` |  |
| PUT | `users/{id}?action=make-autobank-user` |  |
| POST | `users/{id}?action=reset-autobank-password` |  |
| PUT | `users?action=self-reset-autobank-password` |  |
| GET | `users?action=subjectandemail` |  |
| GET | `users?action=user-code-challenge` | reference |
| PUT | `users?action=verify-code-challenge` | reference |

## UserRole — `userroles`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `ID` | integer (int32) |  |
| `SharedRoleId` | integer (int32) |  |
| `SharedRoleName` | string | max 255 |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UserID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `User` | User |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `userroles/{id}?action=audit` | query (required) |
| GET | `userroles?action=audit` | query (required) |
| DELETE | `userroles?action=bulk-delete-roles` | userRoleIds (required) |
| POST | `userroles?action=bulk-insert-roles` |  |

## Approval — `approvals`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AdditionalApprover` | boolean | Whether the approver has been added as an additional approver, a special kind of approver added to the current active step. |
| `Amount` | number (double) | The amount found on the given entity linked by the parent Task. ie. TaxInclusiveAmount found on a SupplierInvoice. Used to prevent stale approvals, such as; invoice has been assigned to user, invoice amount changed, approval is now no longer valid. |
| `ApprovalType` | integer (int32) | Type of Approval. Current active Approvals found on a task, is expected to be of the same value. Future approvals may differ from current.; 0 = One, 1 = All, 2 = Custom |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CurrencyCode` | string | optional, currencycode for amount.; max 255 |
| `Deleted` | boolean |  |
| `ID` | integer (int32) |  |
| `RequiredApprovalCount` | integer (int32) | Use in conjunction with ApprovalType.Custom to define a custom amount of approvers which must approve before proceeding in the flow. All Approval with StepNumber = X will be counted together, so for example if you have 3 Approval with StepNumber = 1, and RequiredApprovalCount = 2, then 2 out of the 3 Approval with StepNumber = 1 must approve before moving to step 2 in the flow. |
| `RequiredDimensions` | integer (int32) | Bitmask of specifying which dimensions must be set on the entity linked by the parent Task before this Approval can be approved. Will be copied from the originating ApprovalRuleStep/TaskApprovalPlan when applicable. Currently only supported for approvals on SupplierInvoice. Defaults to 0 (None); 0 = None, 1 = Project, 2 = Department, 4 = ProjectTask, 8 = Responsible, 16 = Region, … |
| `SharedRoleId` | integer (int32) | Nullable foreign key for Role. Allows for assigning roles instead of UserID; there is not a lot logic tied to this - most likely from early implementation |
| `StatusCode` | integer (int32) | 50120 = Active, 50130 = Approved, 50140 = Rejected, 50150 = Reassigned, 50160 = IndirectlyApproved, 50170 = PreviouslyApproved |
| `StepNumber` | integer (int32) |  |
| `TaskID` | integer (int32) | Foreign key to parent Task. |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UserID` | integer (int32) | Foreign key for User. The user which should approve the current approval. |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Task` | Task |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| POST | `approvals/{id}?action=approve` |  |
| GET | `approvals/{id}?action=audit` | query (required) |
| GET | `approvals?action=audit` | query (required) |
| POST | `approvals/{id}?action=reject` |  |
| GET | `approvals?action=search` | search, status, modelName, skip, top |

## ApprovalRule — `approvalrules`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `Description` | string | Optional description of the rule max length of 100 characters; max 100 |
| `ID` | integer (int32) |  |
| `IndustryCodes` | string | optional industrycodes, currently no logic is tied to this |
| `Keywords` | string | Optional keywords, currently no logic is tied to this |
| `RuleType` | integer (int32) | entity this rule is for. Defaults to SupplierInvoice = 0; 0 = SupplierInvoice, 1 = Payment, 2 = CustomerInvoice, 3 = CustomerOrder, 4 = CustomerQuote, 5 = PurchaseOrder, … |
| `StatusCode` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Steps` | ApprovalRuleStep[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `approvalrules/{id}?action=audit` | query (required) |
| GET | `approvalrules?action=audit` | query (required) |

## Task — `tasks`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `ApprovalRuleID` | integer (int32) | Foreign key to the ApprovalRule that created this task, if any. |
| `ApprovalType` | integer (int32) | Number of approvals which must be approved before proceeding in the flow. Custom means that approvals will be validated by the transition endpoint itself; 0 = One, 1 = All, 2 = Custom |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `EntityID` | integer (int32) | Dynamic foreign key, ID of the record in the table defined by ModelID |
| `ID` | integer (int32) |  |
| `ModelID` | integer (int32) | Foreignkey to Models. Discriminator column which defines the table EntityID corresponds to. |
| `RejectStatusCode` | integer (int32) | StatusCode to set on the entity for the current task, in the event of rejection. Applicable when using Approval Controller endpoints or TransitionThresholds |
| `SharedApproveTransitionId` | integer (int32) | Foreign key to Transition. Transition to run when all Apprvoals have been approved. |
| `SharedRejectTransitionId` | integer (int32) | Foreign key to Transition. Transition to run when an approval in the flow is rejected |
| `SharedRoleId` | integer (int32) | Foreignkey for a Role. Users with this role are able to perform actions on this task; updating the task to complete. |
| `StatusCode` | integer (int32) | 50020 = Active, 50030 = Complete, 50040 = Pending, 50050 = Cancelled |
| `Title` | string | Title with max length of 500. Used as message when creating notifications to assigned users.; max 500 |
| `Type` | integer (int32) | Type of task, does not have much effect, if any.; 0 = Task, 1 = Approval |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UserID` | integer (int32) | Foreign key for the User which created the task. |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `ApprovalPlan` | TaskApprovalPlan[] |
| `Approvals` | Approval[] |
| `CustomValues` | CustomValues |
| `Model` | Model |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| POST | `tasks/{id}?action=activate` |  |
| POST | `tasks/{id}?action=add-additional-approver` |  |
| GET | `tasks/{id}?action=audit` | query (required) |
| GET | `tasks?action=audit` | query (required) |
| POST | `tasks/{id}?action=complete` |  |
| POST | `tasks/{id}?action=pending` |  |

## Comment — `comments`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AuthorID` | integer (int32) |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `EntityID` | integer (int32) |  |
| `EntityType` | string | max 255 |
| `ID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `Text` | string |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Mentioned` | Mentioned[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `comments/{id}?action=audit` | query (required) |
| GET | `comments?action=audit` | query (required) |
| GET | `comments/{entitytype}/{entityid}/{id}?action=audit` | query (required) |
| GET | `comments/{entitytype}/{entityid}?action=audit` | query (required) |

## File — `files`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `ContentType` | string | max 255 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `Description` | string |  |
| `ID` | integer (int32) |  |
| `Md5` | string | max 255 |
| `Name` | string | max 255 |
| `OCRData` | string |  |
| `Pages` | integer (int32) |  |
| `PermaLink` | string | max 1000 |
| `Size` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `StorageReference` | string | max 255 |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `encryptionID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `EntityLinks` | FileEntityLink[] |
| `FileTags` | FileTag[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `filetags/{tagnames}/{status}?action=audit` | query (required) |
| GET | `files/{entitytype}/{entityid}?action=audit` | query (required) |
| GET | `files/{entitytype}/{entityid}/{id}?action=audit` | query (required) |
| GET | `files?action=audit` | query (required) |
| GET | `files/{id}?action=audit` | query (required) |
| GET | `filetags/{tagnames}/{status}/{id}?action=audit` | query (required) |
| DELETE | `files/{entitytype}/{entityid}?action=delete-by-filetag` | fileTagName (required) |
| GET | `files/{entitytype}/{entityid}/{id}?action=download` |  |
| GET | `files/{id}?action=download` |  |
| POST | `files/{entitytype}/{entityid}/{id}?action=finalize` |  |
| POST | `files/{id}?action=finalize` |  |
| DELETE | `files/{id}?action=force-delete-file` |  |
| GET | `files/{id}?action=get-deleted-file` |  |
| GET | `filetags/{tagnames}/{status}?action=get-supplierInvoice-deleted-files` | top, skip |
| GET | `filetags/{tagnames}/{status}?action=get-supplierInvoice-inbox` | top, skip |
| GET | `filetags/{tagnames}/{status}?action=get-supplierInvoice-inbox-count` |  |
| POST | `files/{id}?action=link` | entitytype (required), entityid (required) |
| PUT | `files/{id}?action=link-customerinvoice-attachment-to-journalentry` | entityid (required) |
| GET | `files/{id}?action=ocranalyse` |  |
| GET | `files/{entitytype}/{entityid}/{id}?action=ocranalyse` |  |
| PUT | `filetags/{tagnames}/{status}?action=restore-supplierInvoice-deleted-files` |  |
| PUT | `files/{id}?action=set-is-attachment` | entitytype (required), entityid (required), isAttachment (required) |
| POST | `files?action=split-file` | oldFileID (required), newFileID1 (required), newFileID2 (required) |
| POST | `files?action=split-file-multiple` | oldFileID (required), newFileIds (required) |
| PUT | `files/{id}?action=tag-file-in-use` |  |
| PUT | `files/{id}?action=tag-file-not-in-use` |  |
| POST | `files/{id}?action=unlink` | entitytype (required), entityid (required) |
| POST | `files/{id}?action=unlink-bulk` |  |
| PUT | `files/{id}?action=update-statuscode-file` | entitytype (required), statuscode (required) |
| PUT | `files/{id}?action=update-statuscode-fileentitylink` | entitytype (required), entityid (required), statuscode (required) |
| POST | `files?action=upload` |  |

## CurrencyCode — `currencycodes`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Code` | string |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `Description` | string |  |
| `ID` | integer (int32) |  |
| `Name` | string |  |
| `ShortCode` | string |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `currencycodes/{id}?action=audit` | query (required) |
| GET | `currencycodes?action=audit` | query (required) |

## Terms — `terms`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `CreditDays` | integer (int32) |  |
| `Deleted` | boolean |  |
| `Description` | string | max 255 |
| `ID` | integer (int32) |  |
| `Name` | string | max 30 |
| `StatusCode` | integer (int32) |  |
| `TermsType` | integer (int32) | 1 = PaymentTerms, 2 = DeliveryTerms |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `terms/{id}?action=audit` | query (required) |
| GET | `terms?action=audit` | query (required) |
| GET | `terms?action=get-delivery-terms` |  |
| GET | `terms?action=get-payment-terms` |  |

## NumberSeries — `number-series`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `AccountYear` | integer (int32) |  |
| `Comment` | string | max 255 |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `Disabled` | boolean |  |
| `DisplayName` | string | max 255 |
| `Empty` | boolean |  |
| `FromNumber` | integer (int32) |  |
| `ID` | integer (int32) |  |
| `IsDefaultForTask` | boolean |  |
| `MainAccountID` | integer (int32) |  |
| `Name` | string | max 255 |
| `NextNumber` | integer (int32) |  |
| `NumberLock` | boolean |  |
| `NumberSeriesTaskID` | integer (int32) |  |
| `NumberSeriesTypeID` | integer (int32) |  |
| `StatusCode` | integer (int32) |  |
| `System` | boolean |  |
| `ToNumber` | integer (int32) |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |
| `UseNumbersFromNumberSeriesID` | integer (int32) |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `MainAccount` | Account |
| `NumberSeriesTask` | NumberSeriesTask |
| `NumberSeriesType` | NumberSeriesType |
| `UseNumbersFromNumberSeries` | NumberSeries |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `number-series/{id}?action=audit` | query (required) |
| GET | `number-series?action=audit` | query (required) |
| PUT | `number-series?action=delete-unused-numberseries` | numberSeriesID (required) |
| GET | `number-series?action=get-active-numberseries` | entityType (required), year (required) |
| GET | `number-series?action=get-available-numbers-in-numberseries` | numberSeriesID (required) |
| GET | `number-series?action=get-max-used-number` | numberSeriesID (required) |
| GET | `number-series?action=get-numberseries-asinvoice` |  |
| PUT | `number-series?action=reset-numberseries-next-number` | numberSeriesID (required) |

## ValueList — `valuelists`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `Code` | string |  |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `Deleted` | boolean |  |
| `Description` | string |  |
| `ID` | integer (int32) |  |
| `Name` | string |  |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |
| `Items` | ValueItem[] |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| GET | `valuelists/{id}?action=audit` | query (required) |
| GET | `valuelists?action=audit` | query (required) |

## CustomField — `custom-fields`

### Fields

| Field | Type | Notes |
| --- | --- | --- |
| `CreatedAt` | string (date-time) |  |
| `CreatedBy` | string |  |
| `DataType` | string |  |
| `Deleted` | boolean |  |
| `ID` | integer (int32) |  |
| `ModelID` | integer (int32) |  |
| `Name` | string |  |
| `Nullable` | boolean |  |
| `StatusCode` | integer (int32) | 110100 = Draft, 110101 = Active |
| `UpdatedAt` | string (date-time) |  |
| `UpdatedBy` | string |  |

### Expand

None of these come back unless the query asks for them.

| Property | Leads to |
| --- | --- |
| `CustomValues` | CustomValues |

### Actions

The verb differs per action. Pass the entity string exactly as written.

| Verb | Entity string | Query |
| --- | --- | --- |
| POST | `custom-fields/{id}?action=activate` |  |
| GET | `custom-fields/{id}?action=audit` | query (required) |
| GET | `custom-fields?action=audit` | query (required) |
