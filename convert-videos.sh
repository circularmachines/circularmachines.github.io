#!/bin/bash

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "FFmpeg is not installed. Please install it first."
    echo "On Ubuntu/Debian: sudo apt install ffmpeg"
    echo "On Fedora: sudo dnf install ffmpeg"
    echo "On Arch: sudo pacman -S ffmpeg"
    exit 1
fi

# Convert a single video
convert_video() {
    input_file="$1"
    filename=$(basename -- "$input_file")
    name="${filename%.*}"
    output_file="videos/${name}_converted.mp4"
    
    echo "Converting $input_file to $output_file..."
    
    # Convert to web-compatible MP4 (H.264 video, AAC audio)
    ffmpeg -i "$input_file" -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p -c:a aac -movflags +faststart -an "$output_file"
    
    if [ $? -eq 0 ]; then
        echo "Conversion successful: $output_file"
    else
        echo "Conversion failed for $input_file"
    fi
}

# Convert all videos in the videos directory
convert_all_videos() {
    for video in videos/*; do
        # Skip directories and already converted files
        if [ -f "$video" ] && [[ "$video" != *"_converted.mp4" ]]; then
            convert_video "$video"
        fi
    done
}

# Show usage if no arguments provided
if [ $# -eq 0 ]; then
    echo "Usage:"
    echo "  $0 convert-all         - Convert all videos in the videos directory"
    echo "  $0 convert <filename>  - Convert a specific video file"
    exit 0
fi

# Process command
case "$1" in
    "convert-all")
        convert_all_videos
        ;;
    "convert")
        if [ -z "$2" ]; then
            echo "Error: No input file specified"
            exit 1
        fi
        convert_video "$2"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Usage:"
        echo "  $0 convert-all         - Convert all videos in the videos directory"
        echo "  $0 convert <filename>  - Convert a specific video file"
        exit 1
        ;;
esac