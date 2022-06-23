// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-inferrable-types */

// Scope of AAD app. Use the below configuration to use all the permissions provided in the AAD app through Azure portal.
// Refer https://aka.ms/PowerBIPermissions for complete list of Power BI scopes
export const scopes: string[] = ["https://analysis.windows.net/powerbi/api/Report.Read.All"];

// Client Id (Application Id) of the AAD app.
export const clientId: string = "6b04c589-4d79-410d-81c1-832d2ef254c3";

// Id of the workspace where the report is hosted
export const workspaceId: string = "3fab8396-2540-43b3-9b32-a532bed12660";

// Id of the report to be embedded
export const reportId: string = "36ed2a5c-1209-4720-a651-e557a6d1008f";

export const tenantId: string = "e0793d39-0939-496d-b129-198edd916feb"