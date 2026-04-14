import {
	assertActiveAccount,
	createAuthVerifier,
	createOidcClient,
	type IdentityClaims,
	type LocalAccountState,
	type OidcClientConfig,
	type TokenSet,
} from "auth-core";

export interface KesaKuntoSession {
	accessToken: string;
	idToken?: string;
	refreshToken?: string;
	expiresAt: number;
	scope?: string;
	tokenType: string;
	subject: string;
	email?: string;
}

export interface BeginSignInResult {
	authUrl: string;
	state: string;
	codeVerifier: string;
	nonce: string;
}

export interface CompleteSignInInput {
	code: string;
	codeVerifier: string;
	returnedState: string;
	expectedState: string;
	nonce?: string;
}

export interface AuthIdentity {
	accountId: string;
	subject: string;
	email?: string;
}

export interface KesaKuntoAuthConfig {
	issuer: string;
	clientId: string;
	audience: string;
	redirectUri: string;
	postLogoutRedirectUri?: string;
	scopes: readonly string[];
	changePasswordUrl: string;
}

export interface AccountRecord extends LocalAccountState {
	id: string;
	email?: string | null;
}

export interface RequireAuthInput {
	accessToken: string;
	loadAccountBySubject(subject: string): Promise<AccountRecord | null>;
}

export interface CreateSignOutUrlInput {
	idToken?: string;
	state?: string;
}

const defaultConfig = {
	issuer: "https://auth.satsaa.dev",
	clientId: "kesakunto-mobile",
	audience: "kesakunto-api",
	redirectUri: "kesakunto://auth/callback",
	postLogoutRedirectUri: "kesakunto://auth/logout",
	scopes: ["openid", "profile", "email", "offline_access"],
	changePasswordUrl: "https://auth.satsaa.dev",
} satisfies KesaKuntoAuthConfig;

export function createAuth(config: Partial<KesaKuntoAuthConfig> = {}) {
	const authConfig: KesaKuntoAuthConfig = {
		...defaultConfig,
		...config,
		scopes: config.scopes ? [...config.scopes] : [...defaultConfig.scopes],
	};
	const oidcClient = createOidcClient(toOidcClientConfig(authConfig));
	const authVerifier = createAuthVerifier({
		issuer: authConfig.issuer,
		audience: authConfig.audience,
	});

	return {
		getConfig(): KesaKuntoAuthConfig {
			return {
				...authConfig,
				scopes: [...authConfig.scopes],
			};
		},

		async beginSignIn(): Promise<BeginSignInResult> {
			const request = await oidcClient.createAuthorizationRequest();

			return {
				authUrl: request.authorizationUrl,
				codeVerifier: request.codeVerifier,
				state: request.state,
				nonce: request.nonce,
			};
		},

		async completeSignIn(input: CompleteSignInInput): Promise<KesaKuntoSession> {
			assertExpectedState(input.expectedState, input.returnedState);
			const tokens = await oidcClient.exchangeCode({
				code: input.code,
				codeVerifier: input.codeVerifier,
			});

			return mapTokenSetToSession(tokens, authVerifier, input.nonce);
		},

		async refreshSession(refreshToken: string): Promise<KesaKuntoSession> {
			const tokens = await oidcClient.refresh({
				refreshToken,
			});

			return mapTokenSetToSession(tokens, authVerifier);
		},

		async createSignOutUrl(input: CreateSignOutUrlInput = {}): Promise<string> {
			return oidcClient.createLogoutUrl({
				idTokenHint: input.idToken,
				state: input.state,
			});
		},

		createChangePasswordUrl(): string {
			return authConfig.changePasswordUrl;
		},

		async verifyAccessToken(accessToken: string): Promise<IdentityClaims> {
			return authVerifier.verifyAccessToken(accessToken);
		},

		async requireAuth(input: RequireAuthInput): Promise<AuthIdentity> {
			const claims = await authVerifier.verifyAccessToken(input.accessToken);
			const account = await input.loadAccountBySubject(claims.sub);

			if (account === null) {
				throw new Error("No local account exists for the authenticated subject");
			}

			assertActiveAccount(claims, account);

			return {
				accountId: account.id,
				subject: claims.sub,
				email: claims.email ?? account.email ?? undefined,
			};
		},
	};
}

const defaultAuth = createAuth();

export function getAuthConfig(): KesaKuntoAuthConfig {
	return defaultAuth.getConfig();
}

export async function beginSignIn(): Promise<BeginSignInResult> {
	return defaultAuth.beginSignIn();
}

export async function completeSignIn(
	input: CompleteSignInInput,
): Promise<KesaKuntoSession> {
	return defaultAuth.completeSignIn(input);
}

export async function refreshSession(
	refreshToken: string,
): Promise<KesaKuntoSession> {
	return defaultAuth.refreshSession(refreshToken);
}

export async function createSignOutUrl(
	input: CreateSignOutUrlInput = {},
): Promise<string> {
	return defaultAuth.createSignOutUrl(input);
}

export function createChangePasswordUrl(): string {
	return defaultAuth.createChangePasswordUrl();
}

export async function verifyAccessToken(
	accessToken: string,
): Promise<IdentityClaims> {
	return defaultAuth.verifyAccessToken(accessToken);
}

export async function requireAuth(
	input: RequireAuthInput,
): Promise<AuthIdentity> {
	return defaultAuth.requireAuth(input);
}

function toOidcClientConfig(config: KesaKuntoAuthConfig): OidcClientConfig {
	return {
		issuer: config.issuer,
		clientId: config.clientId,
		redirectUri: config.redirectUri,
		postLogoutRedirectUri: config.postLogoutRedirectUri,
		scopes: [...config.scopes],
		audience: config.audience,
	};
}

function assertExpectedState(expectedState: string, returnedState: string): void {
	if (expectedState !== returnedState) {
		throw new Error("Authorization response state no longer matches");
	}
}

async function mapTokenSetToSession(
	tokenSet: TokenSet,
	authVerifier: ReturnType<typeof createAuthVerifier>,
	nonce?: string,
): Promise<KesaKuntoSession> {
	const accessClaims = await authVerifier.verifyAccessToken(tokenSet.accessToken);
	const idClaims =
		tokenSet.idToken === undefined
			? undefined
			: await authVerifier.verifyIdToken(tokenSet.idToken, nonce);

	return {
		accessToken: tokenSet.accessToken,
		idToken: tokenSet.idToken,
		refreshToken: tokenSet.refreshToken,
		expiresAt: tokenSet.expiresAt,
		scope: tokenSet.scope,
		tokenType: tokenSet.tokenType,
		subject: idClaims?.sub ?? accessClaims.sub,
		email: idClaims?.email ?? accessClaims.email,
	};
}
