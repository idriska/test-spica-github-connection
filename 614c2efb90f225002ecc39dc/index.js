import axios from "axios";

const GOOGLE_STRATEGY_NAME = "Google OAuth"
const FACEBOOK_STRATEGY_NAME = "Facebook OAuth"

const PUBLIC_URL = process.env.__INTERNAL__SPICA__PUBLIC_URL__;
const APIKEY = "4hpcza18ks78t0ub";

export async function loadGoogle(req, res) {
    const strategy = await findStrategy(GOOGLE_STRATEGY_NAME);
    let client_id = undefined;
    let client_secret = undefined

    if (strategy) {
        client_id = strategy.options.access_token.params.client_id;
        client_secret = strategy.options.access_token.params.client_secret;
    }

    return {
        title: "Google",
        description: `Enter the 'Client id' and 'Client secret' then click the apply button.`,
        inputs: [
            {
                key: "client_id",
                type: "textarea",
                value: client_id,
                title: "Client id",
            },
            {
                key: "client_secret",
                type: "textarea",
                value: client_secret,
                title: "Client secret",
            }
        ],
        button: {
            color: "primary",
            target: `${PUBLIC_URL}/fn-execute/upsert-google-oauth`,
            method: "post",
            title: "Apply",
        },
    };
}

export async function loadFacebook(req, res) {
    const strategy = await findStrategy(FACEBOOK_STRATEGY_NAME);
    let client_id = undefined;
    let client_secret = undefined

    if (strategy) {
        client_id = strategy.options.access_token.params.client_id;
        client_secret = strategy.options.access_token.params.client_secret;
    }

    return {
        title: "Facebook",
        description: `Enter the 'Client id' and 'Client secret' then click the apply button.`,
        inputs: [
            {
                key: "client_id",
                type: "textarea",
                value: client_id,
                title: "Client id",
            },
            {
                key: "client_secret",
                type: "textarea",
                value: client_secret,
                title: "Client secret",
            }
        ],
        button: {
            color: "primary",
            target: `${PUBLIC_URL}/fn-execute/upsert-facebook-oauth`,
            method: "get",
            title: "Apply",
        },
    };
}

export async function upsertGoogle(req, res) {
    const { client_id, client_secret } = req.body;

    if (!client_id || !client_secret) {
        return res.status(400).send("Client id or secret is missing.")
    }

    let strategy = await findStrategy(GOOGLE_STRATEGY_NAME);
    if (!strategy) {
        strategy = createGoogleStrategy(client_id, client_secret);
        // notify users that they should add this redirect uri to allowed redirect uris on gcp
        return axios.post(`${PUBLIC_URL}/passport/strategy`, strategy, { headers: { "Authorization": `APIKEY ${APIKEY}` } }).then(r => res.send({ message: `Successfully completed. Please add this '${r.data.options.code.params.redirect_uri}' url to 'Authorized redirect URIs' from Google Cloud Console.` }))
    }

    strategy.options.code.params.client_id = client_id;
    strategy.options.access_token.params.client_id = client_id;
    strategy.options.access_token.params.client_secret = client_secret;

    return axios.put(`${PUBLIC_URL}/passport/strategy/${strategy._id}`, strategy, { headers: { "Authorization": `APIKEY ${APIKEY}` } }).then(_ => "Changes have been saved.")
}

export async function upsertFacebook(req, res) {
    const { client_id, client_secret } = req.query;

    if (!client_id || !client_secret) {
        return res.status(400).send("Client id or secret is missing.")
    }

    let strategy = await findStrategy(FACEBOOK_STRATEGY_NAME);
    if (!strategy) {
        strategy = createFacebookStrategy(client_id, client_secret);
        // notify users that they should add this redirect uri to allowed redirect uris on gcp
        return axios.post(`${PUBLIC_URL}/passport/strategy`, strategy, { headers: { "Authorization": `APIKEY ${APIKEY}` } }).then(r => `Successfully completed. Please add this '${r.data.options.code.params.redirect_uri}' url to 'Authorized redirect URIs' from Facebook API.`)
    }

    strategy.options.code.params.client_id = client_id;
    strategy.options.access_token.params.client_id = client_id;
    strategy.options.access_token.params.client_secret = client_secret;

    return axios.put(`${PUBLIC_URL}/passport/strategy/${strategy._id}`, strategy, { headers: { "Authorization": `APIKEY ${APIKEY}` } }).then(_ => res.send({ message: "Changes have been saved." }))
}

async function findStrategy(name) {
    const { data: strategies } = await axios.get(`${PUBLIC_URL}/passport/strategies`);
    const strategy = strategies.find(s => s.name == name);
    if (!strategy) {
        return
    }
    return axios.get(`${PUBLIC_URL}/passport/strategy/${strategy._id}`, { headers: { "Authorization": `APIKEY ${APIKEY}` } }).then(r => r.data)
}

function createGoogleStrategy(clientId, clientSecret) {
    return {
        type: "oauth",
        name: "Google OAuth",
        title: "Google OAuth",
        icon: "login",
        options: {
            code: {
                base_url: "https://accounts.google.com/o/oauth2/v2/auth",
                params: {
                    client_id: clientId,
                    response_type: "code",
                    scope: "email profile"
                },
                headers: {},
                method: "get"
            },
            access_token: {
                base_url: "https://oauth2.googleapis.com/token",
                params: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: "authorization_code"
                },
                headers: {},
                method: "post"
            },
            identifier: {
                base_url: "https://www.googleapis.com/oauth2/v2/userinfo",
                params: {},
                headers: {},
                method: "get"
            }
        }
    }
}

function createFacebookStrategy(clientId, clientSecret) {
    return {
        type: "oauth",
        name: "Facebook OAuth",
        title: "Facebook OAuth",
        icon: "login",
        options: {
            code: {
                base_url: "https://www.facebook.com/v12.0/dialog/oauth",
                params: {
                    client_id: clientId,
                    scope: "email",
                },
                headers: {},
                method: "get"
            },
            access_token: {
                base_url: "https://graph.facebook.com/v12.0/oauth/access_token",
                params: {
                    client_id: clientId,
                    client_secret: clientSecret,
                    scope: "email",
                },
                headers: {},
                method: "get"
            },
            identifier: {
                base_url: "https://graph.facebook.com/me",
                params: {
                    fields:"email,picture"
                },
                headers: {},
                method: "get"
            }
        }
    }
}                                                                                                                                                                                                                               