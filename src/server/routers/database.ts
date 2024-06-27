import path from 'path'
import fs from 'fs'
import archiver from 'archiver'
import { fileURLToPath } from 'url';
import express from "express";
import { accessDenied } from '../functions/database.js';
import { MyRequest, Result } from '../../types/server.js';
import { PERMISSION, RESOURCE } from "../../types/user.js";
import { databaseFolder, databaseZipFile } from '../options.js';
import { hasPermission } from './users.js';
import { StatusCodes } from 'http-status-codes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
export default router

router.get("/download", async (req, res) => {
  if (!(await hasPermission(req as MyRequest, RESOURCE.DATABASE, [PERMISSION.READ]))) return accessDenied(res)
  const result = await zipDirectory(databaseFolder, databaseZipFile)
  if(result.success) res.download(databaseZipFile, 'database.zip')
});

function zipDirectory(sourceDir: string, outPath: string): Promise<Result<null>> {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(outPath);
  return new Promise((resolve) => {
    archive.directory(sourceDir, false).on('error', err => resolve({success: false, status: StatusCodes.INTERNAL_SERVER_ERROR})).pipe(stream)
    stream.on('close', () => resolve({success: true, status: StatusCodes.OK}));
    archive.finalize();
  });
}



