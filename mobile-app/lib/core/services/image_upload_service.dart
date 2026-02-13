import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import '../api/api_constants.dart';

class ImageUploadService {
  /// Upload a profile picture file to the server
  /// Returns the public URL of the uploaded image
  static Future<String> uploadProfilePicture(File imageFile) async {
    try {
      final uri = Uri.parse('${ApiConstants.baseUrl}/upload-profile-pic');
      
      var request = http.MultipartRequest('POST', uri);
      
      // Add the image file
      request.files.add(
        await http.MultipartFile.fromPath('file', imageFile.path),
      );

      debugPrint('Uploading profile picture to: $uri');
      
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      debugPrint('Upload status: ${response.statusCode}');
      debugPrint('Upload body: ${response.body}');

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        final imageUrl = jsonResponse['url'] as String;
        debugPrint('Profile picture uploaded successfully: $imageUrl');
        return imageUrl;
      } else {
        final errorMessage = _extractErrorMessage(response.body, 'Failed to upload image');
        throw Exception(errorMessage);
      }
    } catch (e) {
      debugPrint('Error uploading profile picture: $e');
      throw Exception('Failed to upload profile picture: ${e.toString()}');
    }
  }

  /// Safely extract error message from response body
  static String _extractErrorMessage(String body, String fallback) {
    if (body.isEmpty) return fallback;
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) {
        return decoded['error'] ?? decoded['message'] ?? fallback;
      }
      return body;
    } catch (_) {
      return body.length > 200 ? '${body.substring(0, 200)}...' : body;
    }
  }
}
