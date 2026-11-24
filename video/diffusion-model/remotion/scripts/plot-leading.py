"""Plot the leading waveform and RMS envelope of a WAV file.

Usage:
    .venv\\Scripts\\python.exe scripts\\plot-leading.py input.wav output.png [seconds]
"""

from __future__ import annotations

import sys
import wave
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit("usage: plot-leading.py input.wav output.png [seconds]")

    wav_path = Path(sys.argv[1])
    out_path = Path(sys.argv[2])
    seconds = float(sys.argv[3]) if len(sys.argv) > 3 else 2.5

    with wave.open(str(wav_path), "rb") as handle:
        sample_rate = handle.getframerate()
        raw = handle.readframes(handle.getnframes())

    samples = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    count = min(len(samples), int(sample_rate * seconds))
    segment = samples[:count]
    time = np.arange(count) / sample_rate

    window = max(1, int(sample_rate * 0.01))
    frame_count = count // window
    rms = np.array(
        [
            np.sqrt(np.mean(segment[i * window : (i + 1) * window] ** 2) + 1e-12)
            for i in range(frame_count)
        ]
    )
    rms_db = 20 * np.log10(rms + 1e-12)
    rms_time = np.arange(frame_count) * 0.01

    figure, axes = plt.subplots(
        2,
        1,
        figsize=(14, 7),
        sharex=True,
        gridspec_kw={"height_ratios": [2, 1]},
    )

    axes[0].plot(time, segment, linewidth=0.35, color="#1f77b4")
    axes[0].set_ylabel("amplitude")
    axes[0].grid(alpha=0.3)
    axes[0].set_title(wav_path.name)

    axes[1].plot(rms_time, rms_db, color="#d62728", linewidth=1.2)
    axes[1].axhline(-40, color="gray", linestyle="--", linewidth=1, label="-40 dB")
    axes[1].axhline(-30, color="orange", linestyle="--", linewidth=1, label="-30 dB")
    axes[1].set_ylabel("RMS (dBFS)")
    axes[1].set_xlabel("seconds")
    axes[1].set_ylim(-80, 0)
    axes[1].grid(alpha=0.3)
    axes[1].legend(loc="lower right")

    figure.tight_layout()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    figure.savefig(out_path, dpi=140)
    print(f"saved {out_path}")

    print("time   RMS dB")
    for index in range(0, min(frame_count, 120), 5):
        print(f"{rms_time[index]:5.2f}  {rms_db[index]:7.1f}")


if __name__ == "__main__":
    main()
