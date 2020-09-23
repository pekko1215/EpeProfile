import Express from "express";
import Request from "request-promise-native";
const App = Express();

type PlatForm = 'psn' | 'xbl' | 'origin';

function createAPIURL(platForm: PlatForm, userName: string) {
    return `https://public-api.tracker.gg/v2/apex/standard/profile/${platForm}/${userName}`
}

App.get('/profile', async (req, res, next) => {
    let url = createAPIURL(req.query.platForm as PlatForm, req.query.userName as string)
    try {
        return res.json(JSON.parse(await Request.get(url, {
            method: "GET",
            headers: {
                "TRN-Api-Key": process.env["APEX_TRACKER_API_KEY"]
            }
        })))
    } catch (e) {
        console.log("Error: "+ url)
        return res.json({error:true})
    }
})

export const path = "/api/"
export const handler = App;