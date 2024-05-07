using System;
using System.Security.Cryptography;
using System.Text;
namespace FitnessApp.Utils;
public static class Utils
{
    public static string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            // Convert password string to a byte array
            var bytes = Encoding.UTF8.GetBytes(password);

            // Compute hash
            var hash = sha256.ComputeHash(bytes);

            // Convert hash byte array back to string
            return Convert.ToBase64String(hash);
        }
    }

    public static bool VerifyPassword(string enteredPassword, string storedHash)
    {
        var enteredHash = HashPassword(enteredPassword);
        return enteredHash == storedHash;
    }
}
