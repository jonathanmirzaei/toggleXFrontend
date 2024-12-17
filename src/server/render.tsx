import ReactDOMServer from "react-dom/server";

import { fetchFeature, fetchFeatureList } from "../api-client";
import App from "../components/app";

const serverRender = async (req) => {

    const { name } = req.params;
    // name: req.params.name
    console.log("name: "+req.params.id);
    
    // const initialData = name
    //     ? { feature: await fetchFeature(name) }
    //     : { features: await fetchFeatureList() }

    // const features = await fetchFeatureList("","");
    const initialData = {}
    
    const initialMarkup = ReactDOMServer.renderToString(
        // <App initialData={""} userName={"Empty"}/>
    );
    return { initialMarkup, initialData }

}

export default serverRender;