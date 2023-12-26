import * as exif from 'exif';
import * as geolib from 'geolib';

export function getGPSData(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    new exif.ExifImage({ image: filePath }, (err, exifData) => {
      if (err) {
        reject(err);
      } else {
        resolve(exifData.gps);
      }
    });
  });
}

export function convertGPSToCoordinates(
  gpsData,
): { latitude: number; longitude: number } | null {
  if (!gpsData) {
    return null;
  }
  console.log(gpsData);
  const latitude = geolib.sexagesimalToDecimal(
    `${gpsData.GPSLatitude[0]}° ${gpsData.GPSLatitude[1]}' ${gpsData.GPSLatitude[2]}" ${gpsData.GPSLatitudeRef}`,
  );
  const longitude = geolib.sexagesimalToDecimal(
    `${gpsData.GPSLongitude[0]}° ${gpsData.GPSLongitude[1]}' ${gpsData.GPSLongitude[2]}" ${gpsData.GPSLongitudeRef}`,
  );

  return { latitude, longitude };
}
