import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:flutter/foundation.dart';
import '../api/api_constants.dart';

class ImageUploadService {
  /// Upload a profile picture file to the server
  /// Returns the public URL of the uploaded image
  static Future<String> uploadProfilePicture(File imageFile) async {
    try {
      final uri = Uri.parse('${ApiConstants.baseUrl}/upload-profile-pic');

      var request = http.MultipartRequest('POST', uri);

      final mediaType = _resolveMediaType(imageFile.path);
      final safeName = 'profile_${DateTime.now().millisecondsSinceEpoch}.${mediaType.subtype}';

      // Add the image file with explicit image content type.
      request.files.add(
        await http.MultipartFile.fromPath(
          'file',
          imageFile.path,
          filename: safeName,
          contentType: mediaType,
        ),
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

  static MediaType _resolveMediaType(String path) {
    final lower = path.toLowerCase();

    if (lower.endsWith('.png')) return MediaType('image', 'png');
    if (lower.endsWith('.webp')) return MediaType('image', 'webp');
    if (lower.endsWith('.heic') || lower.endsWith('.heif')) {
      return MediaType('image', 'heic');
    }
    if (lower.endsWith('.gif')) return MediaType('image', 'gif');

    // Default common camera/gallery output on Android.
    return MediaType('image', 'jpeg');
  }
}
