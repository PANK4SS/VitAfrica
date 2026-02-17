import 'dart:io';
import 'dart:async';
import 'package:flutter/material.dart';
import '../../core/api/api_constants.dart';
import '../../core/theme/colors.dart';
import '../../core/services/patient_service.dart';
import '../../core/services/auth_service.dart';
import '../../core/models/profile_response.dart';
import '../auth/presentation/login_screen.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  ProfileResponse? _profile;
  bool _isLoading = true;
  String? _error;
  Timer? _refreshTimer;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      final data = await PatientService.getProfile();
      if (mounted) {
        setState(() {
          _profile = data;
          _isLoading = false;
        });
      }
      // Start auto-refresh once the first profile is loaded, so avatar changes propagate automatically.
      _refreshTimer ??= Timer.periodic(const Duration(seconds: 45), (_) async {
        try {
          final refreshed = await PatientService.getProfile();
          if (mounted) {
            setState(() {
              _profile = refreshed;
            });
          }
        } catch (_) {
          // Ignore periodic refresh errors to avoid disturbing the user.
        }
      });
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString().replaceFirst('Exception: ', '');
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleLogout() async {
    await AuthService.logout();
    if (mounted) {
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (context) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      );
    }

    if (_error != null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.cloud_off, size: 48, color: Colors.grey[400]),
              const SizedBox(height: 12),
              Text(_error!, style: TextStyle(color: Colors.grey[600])),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () {
                  setState(() {
                    _isLoading = true;
                    _error = null;
                  });
                  _loadData();
                },
                icon: const Icon(Icons.refresh, size: 18),
                label: const Text('Retry'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    final profile = _profile!;

    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SingleChildScrollView(
        child: Column(
          children: [
            // ===== PROFILE HEADER =====
            _buildProfileHeader(profile),
            const SizedBox(height: 24),

            // ===== INFO TILES =====
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  _buildInfoTile(
                    icon: Icons.person_outline,
                    label: 'Full Name',
                    value: profile.name ?? 'N/A',
                  ),
                  const SizedBox(height: 12),
                  _buildInfoTile(
                    icon: Icons.email_outlined,
                    label: 'Email',
                    value: profile.email ?? 'N/A',
                  ),
                  const SizedBox(height: 12),
                  _buildInfoTile(
                    icon: Icons.phone_android,
                    label: 'Phone',
                    value: profile.phone ?? 'N/A',
                  ),
                  const SizedBox(height: 12),
                  _buildInfoTile(
                    icon: Icons.location_on_outlined,
                    label: 'Address',
                    value: profile.locationAddress ?? 'N/A',
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),

            // ===== LOGOUT BUTTON =====
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: _handleLogout,
                  icon: const Icon(Icons.logout, size: 20),
                  label: const Text(
                    'Logout',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: const BorderSide(color: Colors.red, width: 1.5),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  /// Helper function to get the correct ImageProvider (FileImage for local paths, NetworkImage for URLs)
  ImageProvider? _getImageProvider(String? imagePath) {
    if (imagePath == null || imagePath.isEmpty) return null;

    final value = imagePath.trim();

    // Normalize legacy / inconsistent persisted shapes for backend-hosted profile pictures.
    const profileMarker = 'profile-pictures/';
    if (value.contains(profileMarker) && !value.contains('/api/files/profile-pictures/')) {
      final idx = value.lastIndexOf(profileMarker);
      final filename = value.substring(idx + profileMarker.length);
      if (filename.isNotEmpty) {
        return NetworkImage(
          '${ApiConstants.baseHost}/api/files/profile-pictures/${filename.replaceFirst(RegExp(r'^/+'), '')}',
        );
      }
    }

    // Fix legacy URLs that still point to an old local IP by mapping them to the current public backend host.
    const legacyHost = 'http://192.168.100.202:8080';
    if (value.startsWith(legacyHost)) {
      final path = value.substring(legacyHost.length);
      final normalizedPath = path.startsWith('/') ? path : '/$path';
      return NetworkImage('${ApiConstants.baseHost}$normalizedPath');
    }

    // Absolute backend URL: force host to current baseHost if it's a backend file URL.
    if (value.startsWith('http://') || value.startsWith('https://')) {
      final filePathIdx = value.indexOf('/api/files/profile-pictures/');
      if (filePathIdx != -1) {
        return NetworkImage('${ApiConstants.baseHost}${value.substring(filePathIdx)}');
      }
      return NetworkImage(value);
    }

    // Relative API URL.
    if (value.startsWith('/api/')) {
      return NetworkImage('${ApiConstants.baseHost}$value');
    }
    if (value.startsWith('api/')) {
      return NetworkImage('${ApiConstants.baseHost}/$value');
    }

    // Local file path.
    if (value.startsWith('/') || value.startsWith('file://')) {
      // Remove file:// prefix if present
      final cleanPath = value.replaceFirst('file://', '');
      final file = File(cleanPath);
      if (file.existsSync()) {
        return FileImage(file);
      }
      return null;
    }

    return null;
  }

  Widget _buildProfileHeader(ProfileResponse profile) {
    final imageProvider = _getImageProvider(profile.profilePicUrl);
    
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(top: 60, bottom: 30),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [AppColors.primary, Color(0xFF0A0A8A)],
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(32),
          bottomRight: Radius.circular(32),
        ),
      ),
      child: Column(
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.secondary, width: 3),
              color: Colors.white.withOpacity(0.2),
              image: imageProvider != null
                  ? DecorationImage(
                      image: imageProvider,
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: imageProvider == null
                ? const Icon(Icons.person, size: 50, color: Colors.white70)
                : null,
          ),
          const SizedBox(height: 16),
          Text(
            profile.name ?? 'Patient',
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            profile.email ?? '',
            style: TextStyle(
              fontSize: 14,
              color: Colors.white.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.08),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: AppColors.primary, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[500],
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
