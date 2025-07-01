#!/usr/bin/env python3.11

import requests
import re

BING_API_URL = "https://cn.bing.com/hp/api/model"

def get_bing_background_media_path() -> str | None:
    """Fetch the Bing background image URL from the API."""
    try:
        response = requests.get(BING_API_URL)
        response.raise_for_status()
        data = response.json()
        if media_contents := data.get('MediaContents', []):
            for item in media_contents:
                if image_content := item.get('ImageContent'):
                    return image_content.get('Image', {}).get('Url')
    except Exception as e:
        print(f"Error fetching Bing background: {e}")
    return None

def download_webp_from_url(url: str) -> bool:
    """Download a .webp image from the given URL and save it locally."""
    match = re.search(r'OHR\.([^.]+)\.webp', url)
    if not match:
        print("Could not extract filename from URL.")
        return False
    filename = f"{match[1]}.webp"
    print(f"Downloading {url} as {filename} ...")
    try:
        resp = requests.get(url)
        resp.raise_for_status()
        with open(filename, 'wb') as f:
            f.write(resp.content)
        print(f"Saved as {filename}")
        return True
    except Exception as e:
        print(f"Error downloading image: {e}")
        return False

if __name__ == "__main__":
    if media_path := get_bing_background_media_path():
        print("Bing background media path:", media_path)
        download_webp_from_url(media_path)
    else:
        print("Could not find Bing background media path.")
