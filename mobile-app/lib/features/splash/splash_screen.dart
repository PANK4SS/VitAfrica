import 'package:flutter/material.dart';
import '../../core/theme/colors.dart';
import '../../core/api/token_storage.dart';
import '../auth/presentation/login_screen.dart';
import '../main/main_shell.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<Offset> _logoSlideAnimation;
  late Animation<double> _sloganFadeAnimation;
  late Animation<Offset> _sloganSlideAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    );

    // Initial delay before starting animation (optional, but good for smooth entry)
    // We'll just define the intervals.

    // Logo slides up from 0.0 to 1.0 (relative to its height? No, offset is relative to child size)
    // We want to move it up slightly.
    _logoSlideAnimation =
        Tween<Offset>(begin: Offset.zero, end: const Offset(0, -0.5)).animate(
          CurvedAnimation(
            parent: _controller,
            curve: const Interval(0.2, 0.6, curve: Curves.easeOut),
          ),
        );

    // Slogan fades in and slides from left
    _sloganFadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: const Interval(0.6, 1.0, curve: Curves.easeIn),
      ),
    );

    _sloganSlideAnimation =
        Tween<Offset>(
          begin: const Offset(-0.2, 0.0), // Start slightly to the left
          end: Offset.zero,
        ).animate(
          CurvedAnimation(
            parent: _controller,
            curve: const Interval(0.6, 1.0, curve: Curves.easeOut),
          ),
        );

    _controller.forward();

    _controller.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        Future.delayed(const Duration(seconds: 2), () async {
          if (mounted) {
            final hasToken = await TokenStorage.hasToken();
            if (mounted) {
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(
                  builder: (context) =>
                      hasToken ? const MainShell() : const LoginScreen(),
                ),
              );
            }
          }
        });
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Background Image
          Positioned.fill(
            child: Image.asset(
              'assets/images/hospital.webp',
              fit: BoxFit.cover,
            ),
          ),
          // Gradient Overlay
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    AppColors.primary.withOpacity(0.9),
                    AppColors.primary.withOpacity(0.7),
                  ],
                ),
              ),
            ),
          ),
          // Content
          Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Logo with Slide Animation
                SlideTransition(
                  position: _logoSlideAnimation,
                  child: Image.asset(
                    'assets/logo/splash_logo.png',
                    width: 200,
                    errorBuilder: (context, error, stackTrace) {
                      return const Text(
                        'VitAfrica',
                        style: TextStyle(
                          fontSize: 40,
                          fontWeight: FontWeight.bold,
                          color: AppColors.secondary,
                        ),
                      );
                    },
                  ),
                ),
                // Spacing that effectively gets filled by the slide up of the logo
                // but we want the slogan to appear below where the logo ends up?
                // Actually if logo slides UP, the space below it increases?
                // Let's keep it simple.

                // Slogan with Fade and Slide Animation
                // We wrap it in a container or just place it.
                // Since logo moves up, we might want to position this absolutely or just rely on Column layout.
                // If logo moves UP visually (transform), it doesn't affect layout flow. Slogan will be right below original logo position.
                // If we want slogan to be comfortably below the NEW position of logo, we might need to adjust spacing.
                const SizedBox(height: 20),
                SlideTransition(
                  position: _sloganSlideAnimation,
                  child: FadeTransition(
                    opacity: _sloganFadeAnimation,
                    child: const Text(
                      'Transforming health. One click at a time.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 18,
                        color: Colors.white,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
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
