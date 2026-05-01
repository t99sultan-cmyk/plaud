import { spawn } from "node:child_process";

export class FfmpegError extends Error {
  constructor(
    message: string,
    public readonly stderr: string,
  ) {
    super(message);
  }
}

/**
 * Run ffmpeg with the given args. Resolves with stderr (where ffmpeg writes
 * progress/info) on success, rejects with stderr on non-zero exit.
 */
export function runFfmpeg(args: string[], binary = "ffmpeg"): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(binary, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    proc.on("error", (err) => reject(err));
    proc.on("close", (code) => {
      if (code === 0) resolve(stderr);
      else reject(new FfmpegError(`ffmpeg exited with ${code}`, stderr));
    });
  });
}

/** Get the duration of a media file in seconds via ffprobe. */
export function probeDuration(filePath: string, binary = "ffprobe"): Promise<number> {
  return new Promise((resolve, reject) => {
    const proc = spawn(binary, [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      filePath,
    ]);
    let out = "";
    let err = "";
    proc.stdout.on("data", (c) => (out += c.toString()));
    proc.stderr.on("data", (c) => (err += c.toString()));
    proc.on("error", reject);
    proc.on("close", (code) => {
      if (code !== 0) return reject(new FfmpegError("ffprobe failed", err));
      const seconds = parseFloat(out.trim());
      if (Number.isNaN(seconds)) return reject(new Error(`Bad duration: ${out}`));
      resolve(seconds);
    });
  });
}
