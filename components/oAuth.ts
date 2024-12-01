import { PublicClientApplication } from "https://deno.land/x/azure_msal_deno@v1.1.0/mod.ts";

export const psa = new PublicClientApplication({
    auth: {
        clientId: Deno.env.get("CLIENT_ID")!,
        authority: `https://login.microsoftonline.com/${Deno.env.get("TENANT_ID")}`,  
    }
});