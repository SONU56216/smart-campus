package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.model.Student
import com.example.ui.screens.*
import com.example.ui.theme.*
import com.example.viewmodel.CampusViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                MainAppScaffold()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppScaffold() {
    val viewModel: CampusViewModel = viewModel()
    val activeStudent by viewModel.activeStudent.collectAsState()
    val allStudents by viewModel.students.collectAsState()

    var currentRoute by remember { mutableStateOf("home") }
    var showProfilePicker by remember { mutableStateOf(false) }

    val student = activeStudent ?: return

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "CAMPUSPASS",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Black,
                            color = CampusM3DeepPurple,
                            letterSpacing = 1.6.sp
                        )
                        Text(
                            text = "Smart Campus Ecosystem",
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3PrimaryPurple,
                            letterSpacing = 0.5.sp
                        )
                    }
                },
                navigationIcon = {
                    Box(
                        modifier = Modifier
                            .padding(start = 12.dp)
                            .size(36.dp)
                            .background(CampusM3PurpleContainer, CircleShape)
                            .clickable { showProfilePicker = true },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = student.fullName.split(" ").map { it.take(1) }.joinToString("").uppercase(),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = CampusM3DeepPurple
                        )
                    }
                },
                actions = {
                    IconButton(
                        onClick = { /* Simulated alerts click */ },
                        modifier = Modifier.padding(end = 6.dp)
                    ) {
                        Box {
                            Icon(
                                imageVector = Icons.Default.Notifications,
                                contentDescription = "Campus Circulars notifications",
                                tint = CampusM3DeepPurple
                            )
                            // Red beacon notification dot
                            Box(
                                modifier = Modifier
                                    .size(7.dp)
                                    .background(CampusM3ErrorRed, CircleShape)
                                    .align(Alignment.TopEnd)
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = CampusBackground
                )
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Color.White,
                tonalElevation = 0.dp,
                modifier = Modifier.border(width = 0.5.dp, color = CampusM3Border)
            ) {
                NavigationBarItem(
                    selected = currentRoute == "home",
                    onClick = { currentRoute = "home" },
                    icon = { Icon(imageVector = if (currentRoute == "home") Icons.Filled.QrCode else Icons.Outlined.QrCode, contentDescription = "ID Card Home") },
                    label = { Text("ID Card", fontSize = 9.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = CampusM3DeepPurple,
                        selectedTextColor = CampusM3DeepPurple,
                        indicatorColor = CampusM3PurpleContainer,
                        unselectedIconColor = CampusM3BodyGray,
                        unselectedTextColor = CampusM3BodyGray
                    ),
                    modifier = Modifier.testTag("nav_item_home")
                )

                NavigationBarItem(
                    selected = currentRoute == "library",
                    onClick = { currentRoute = "library" },
                    icon = { Icon(imageVector = if (currentRoute == "library") Icons.Filled.Book else Icons.Outlined.Book, contentDescription = "Digital library catalog") },
                    label = { Text("Library", fontSize = 9.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = CampusM3DeepPurple,
                        selectedTextColor = CampusM3DeepPurple,
                        indicatorColor = CampusM3PurpleContainer,
                        unselectedIconColor = CampusM3BodyGray,
                        unselectedTextColor = CampusM3BodyGray
                    ),
                    modifier = Modifier.testTag("nav_item_library")
                )

                NavigationBarItem(
                    selected = currentRoute == "services",
                    onClick = { currentRoute = "services" },
                    icon = { Icon(imageVector = if (currentRoute == "services") Icons.Filled.Widgets else Icons.Outlined.Widgets, contentDescription = "Campus utility portals") },
                    label = { Text("Utilities", fontSize = 9.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = CampusM3DeepPurple,
                        selectedTextColor = CampusM3DeepPurple,
                        indicatorColor = CampusM3PurpleContainer,
                        unselectedIconColor = CampusM3BodyGray,
                        unselectedTextColor = CampusM3BodyGray
                    ),
                    modifier = Modifier.testTag("nav_item_services")
                )

                NavigationBarItem(
                    selected = currentRoute == "account",
                    onClick = { currentRoute = "account" },
                    icon = { Icon(imageVector = if (currentRoute == "account") Icons.Filled.AccountCircle else Icons.Outlined.AccountCircle, contentDescription = "Credentials Profile") },
                    label = { Text("Transcript", fontSize = 9.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = CampusM3DeepPurple,
                        selectedTextColor = CampusM3DeepPurple,
                        indicatorColor = CampusM3PurpleContainer,
                        unselectedIconColor = CampusM3BodyGray,
                        unselectedTextColor = CampusM3BodyGray
                    ),
                    modifier = Modifier.testTag("nav_item_account")
                )
            }
        },
        contentWindowInsets = WindowInsets.navigationBars // Ensure edge-to-edge safety padding
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            when (currentRoute) {
                "home" -> HomeScreen(
                    viewModel = viewModel,
                    onNavigateToServices = { currentRoute = "services" }
                )
                "library" -> LibraryScreen(
                    viewModel = viewModel
                )
                "services" -> ServicesScreen(
                    viewModel = viewModel
                )
                "account" -> AccountScreen(
                    viewModel = viewModel
                )
                else -> HomeScreen(
                    viewModel = viewModel,
                    onNavigateToServices = { currentRoute = "services" }
                )
            }
        }
    }

    // --- Interactive Student Switcher Popup Dialog ---
    if (showProfilePicker) {
        Dialog(onDismissRequest = { showProfilePicker = false }) {
            Card(
                modifier = Modifier
                    .fillMaxWidth(0.95f)
                    .fillMaxHeight(0.65f),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    Text(
                        text = "SWITCH STUDENT PROFILE",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = CampusM3PrimaryPurple,
                        letterSpacing = 1.sp,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )

                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(allStudents) { std ->
                            val isSelected = std.id == student.id
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(
                                        color = if (isSelected) CampusM3PurpleContainer else CampusM3GraySurface,
                                        shape = RoundedCornerShape(14.dp)
                                    )
                                    .border(
                                        width = if (isSelected) 1.5.dp else 0.5.dp,
                                        color = if (isSelected) CampusM3PrimaryPurple else CampusM3Border,
                                        shape = RoundedCornerShape(14.dp)
                                    )
                                    .clickable {
                                        viewModel.selectStudent(std.id)
                                        showProfilePicker = false
                                    }
                                    .padding(12.dp),
                                horizontalArrangement = Arrangement.spacedBy(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .background(CampusM3DeepPurple, CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = std.fullName.split(" ").map { it.take(1) }.joinToString("").uppercase(),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.White
                                    )
                                }
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = std.fullName,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = CampusM3DarkText
                                    )
                                    Text(
                                        text = "${std.rollNumber} • ${std.course} • Sem ${std.semester}",
                                        fontSize = 10.sp,
                                        color = CampusM3BodyGray
                                    )
                                }
                                if (isSelected) {
                                    Icon(
                                        imageVector = Icons.Default.CheckCircle,
                                        contentDescription = "Selected",
                                        tint = CampusM3PrimaryPurple
                                    )
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Button(
                        onClick = { showProfilePicker = false },
                        colors = ButtonDefaults.buttonColors(containerColor = CampusM3PrimaryPurple),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Dismiss", fontSize = 11.sp)
                    }
                }
            }
        }
    }
}
