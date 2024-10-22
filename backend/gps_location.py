from PIL.ExifTags import TAGS, GPSTAGS
from PIL import Image
import ffmpeg
from backend import create_app
import exiftool
import os

app = create_app()

def convert_to_decimal_degrees(dms, ref):
    degrees, minutes, seconds = dms
    decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
    if ref in ['S', 'W']:
        decimal = -decimal
    return decimal

def get_exif_data(image_path):
    try:
        image = Image.open(image_path)
        exif_data = image._getexif()
        if exif_data is not None:
            exif = {TAGS.get(tag): value for tag, value in exif_data.items()}
            if 'GPSInfo' in exif:
                gps_info = exif['GPSInfo']
                gps_data = {}
                for key in gps_info.keys():
                    gps_tag = GPSTAGS.get(key, key)
                    gps_data[gps_tag] = gps_info[key]
                if 'GPSLatitude' in gps_data and 'GPSLatitudeRef' in gps_data:
                    exif['GPSLatitude'] = convert_to_decimal_degrees(gps_data['GPSLatitude'], gps_data['GPSLatitudeRef'])
                if 'GPSLongitude' in gps_data and 'GPSLongitudeRef' in gps_data:
                    exif['GPSLongitude'] = convert_to_decimal_degrees(gps_data['GPSLongitude'], gps_data['GPSLongitudeRef'])
            return exif
    except Exception as e:
        app.logger.error(f"Error extracting EXIF data: {e}")
    return {}