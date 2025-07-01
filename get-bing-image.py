#!/usr/bin/env python3.11

import requests
import re

def get_bing_background_media_path():
    url = "https://cn.bing.com/hp/api/model"
    response = requests.get(url)
    response.raise_for_status()
    data = response.json()
    # The background image info is usually under 'MediaContents'
    media_contents = data.get('MediaContents', [])
    if media_contents:
        # The 'ImageContent' type usually contains the background image
        for item in media_contents:
            if item.get('ImageContent'):
                image_content = item['ImageContent']
                media_path = image_content.get('Image', {}).get('Url')
                return media_path
    return None

def download_webp_from_url(url):
    # Extract the filename after 'OHR.' and before '.webp'
    match = re.search(r'OHR\.([^.]+)\.webp', url)
    if not match:
        print("Could not extract filename from URL.")
        return
    filename = match.group(1) + ".webp"
    print(f"Downloading {url} as {filename} ...")
    resp = requests.get(url)
    resp.raise_for_status()
    with open(filename, 'wb') as f:
        f.write(resp.content)
    print(f"Saved as {filename}")
if __name__ == "__main__":
    media_path = get_bing_background_media_path()
    if media_path:
        print("Bing background media path:", media_path)
        download_webp_from_url(media_path)
    else:
        print("Could not find Bing background media path.")
