namespace TheSeatLineApi.Common.Helpers
{
    public static class LocationHelper
    {
        private const double EarthRadiusKm = 6371.0;

        /// <summary>
        /// Calculate distance between two GPS coordinates using Haversine formula
        /// </summary>
        /// <param name="lat1">Latitude of point 1</param>
        /// <param name="lon1">Longitude of point 1</param>
        /// <param name="lat2">Latitude of point 2</param>
        /// <param name="lon2">Longitude of point 2</param>
        /// <returns>Distance in kilometers</returns>
        public static double CalculateDistance(decimal lat1, decimal lon1, decimal lat2, decimal lon2)
        {
            var dLat = ToRadians((double)(lat2 - lat1));
            var dLon = ToRadians((double)(lon2 - lon1));

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(ToRadians((double)lat1)) * 
                    Math.Cos(ToRadians((double)lat2)) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var distance = EarthRadiusKm * c;

            return Math.Round(distance, 2);
        }

        /// <summary>
        /// Check if a point is within a given radius of another point
        /// </summary>
        public static bool IsWithinRadius(decimal lat1, decimal lon1, decimal lat2, decimal lon2, int radiusKm)
        {
            var distance = CalculateDistance(lat1, lon1, lat2, lon2);
            return distance <= radiusKm;
        }

        /// <summary>
        /// Convert degrees to radians
        /// </summary>
        private static double ToRadians(double degrees)
        {
            return degrees * Math.PI / 180.0;
        }
    }
}
