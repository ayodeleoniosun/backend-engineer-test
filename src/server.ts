import "dotenv/config";
import { createServer } from "http";
import app from "./app";
import {config} from './config/index';

const { port } = config;

const server = createServer(app);

server.listen(port, () => console.log(`Server running on port ${port}`));