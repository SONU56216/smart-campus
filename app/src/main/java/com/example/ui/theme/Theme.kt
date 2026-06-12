package com.example.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
  primary = Purple80,
  secondary = PurpleGrey80,
  tertiary = Pink80,
  background = CampusM3DarkBlue,
  surface = CampusM3DarkBlue,
  onPrimary = CampusM3DeepPurple,
  onBackground = CampusBackground,
  onSurface = CampusBackground
)

private val LightColorScheme = lightColorScheme(
  primary = CampusM3PrimaryPurple,
  secondary = CampusM3LightBlue,
  tertiary = CampusM3DeepPurple,
  background = CampusBackground,
  surface = CampusBackground,
  onPrimary = CampusBackground,
  onSecondary = CampusM3DarkBlue,
  onTertiary = CampusBackground,
  onBackground = CampusM3DarkText,
  onSurface = CampusM3DarkText,
  surfaceVariant = CampusM3GraySurface,
  onSurfaceVariant = CampusM3BodyGray,
  outline = CampusM3Border,
  error = CampusM3ErrorRed
)

@Composable
fun MyApplicationTheme(
  darkTheme: Boolean = isSystemInDarkTheme(),
  // Dynamic color is available on Android 12+ (forced off here to preserve High Density styling consistency)
  dynamicColor: Boolean = false,
  content: @Composable () -> Unit,
) {
  val colorScheme = when {
    dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
      val context = LocalContext.current
      if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
    }
    darkTheme -> DarkColorScheme
    else -> LightColorScheme
  }

  MaterialTheme(
    colorScheme = colorScheme,
    typography = Typography,
    content = content
  )
}
