import Exif, * as exif from 'exif';
import * as geolib from 'geolib';

export function getGPSData(filePath: string): Promise<Exif.ExifData> {
  return new Promise((resolve, reject) => {
    new exif.ExifImage({ image: filePath }, (err, exifData) => {
      if (err) {
        reject(err);
      } else {
        resolve(exifData);
      }
    });
  });
}

export function convertGPSToCoordinates(
  gpsData: Exif.ExifData,
): { latitude: number; longitude: number } | null {
  if (!gpsData) {
    return null;
  }
  const latitude = geolib.sexagesimalToDecimal(
    `${gpsData.gps.GPSLatitude[0]}° ${gpsData.gps.GPSLatitude[1]}' ${gpsData.gps.GPSLatitude[2]}" ${gpsData.gps.GPSLatitudeRef}`,
  );
  const longitude = geolib.sexagesimalToDecimal(
    `${gpsData.gps.GPSLongitude[0]}° ${gpsData.gps.GPSLongitude[1]}' ${gpsData.gps.GPSLongitude[2]}" ${gpsData.gps.GPSLongitudeRef}`,
  );

  return { latitude, longitude };
}
