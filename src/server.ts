import {connectToDB} from "./config/database";

import {app} from './app';
import config from "./config";

const {port} = config;

app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    await connectToDB();
});