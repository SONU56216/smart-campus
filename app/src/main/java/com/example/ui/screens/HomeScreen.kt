package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.model.*
import com.example.ui.theme.*
import com.example.viewmodel.CampusViewModel
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun HomeScreen(
    viewModel: CampusViewModel,
    onNavigateToServices: () -> Unit,
    modifier: Modifier = Modifier
) {
    val activeStudent by viewModel.activeStudent.collectAsState()
    val qrToken by viewModel.secureQrToken.collectAsState()
    val qrTimeLeft by viewModel.qrTimeRemaining.collectAsState()

    // Interactive Dialogs
    var showProfileSheet by remember { mutableStateOf(false) }
    var activeQuickAction by remember { mutableStateOf<String?>(null) } // "admission", "exam", "payment", "attendance"

    val student = activeStudent

    if (student == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = CampusM3PrimaryPurple)
        }
        return
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(CampusBackground)
            .padding(horizontal = 14.dp)
            .testTag("home_screen_scroll"),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(top = 8.dp, bottom = 24.dp)
    ) {
        // 1. Digital ID Card (Compact Material Container Card)
        item {
            DigitalIdCard(
                student = student,
                qrToken = qrToken,
                qrTimeLeft = qrTimeLeft,
                onWalletClick = { activeQuickAction = "payment" }
            )
        }

        // 2. High-Density Quick Actions Grid (Row/Grid implementation)
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.Transparent),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(vertical = 4.dp)) {
                    Text(
                        text = "QUICK ACTIONS",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = CampusM3PrimaryPurple,
                            letterSpacing = 1.2.sp
                        ),
                        modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        QuickActionItem(
                            title = "Admission",
                            icon = Icons.Outlined.Assignment,
                            containerColor = CampusM3LightBlue,
                            iconColor = CampusM3DarkBlue,
                            tag = "action_btn_admission",
                            onClick = { activeQuickAction = "admission" }
                        )

                        QuickActionItem(
                            title = "Semester Exam",
                            icon = Icons.Outlined.EventNote,
                            containerColor = CampusM3LightBlue,
                            iconColor = CampusM3DarkBlue,
                            tag = "action_btn_exam",
                            onClick = { activeQuickAction = "exam" }
                        )

                        QuickActionItem(
                            title = "Payments",
                            icon = Icons.Outlined.AccountBalanceWallet,
                            containerColor = CampusM3LightBlue,
                            iconColor = CampusM3DarkBlue,
                            tag = "action_btn_payment",
                            onClick = { activeQuickAction = "payment" }
                        )

                        QuickActionItem(
                            title = "Attendance",
                            icon = Icons.Outlined.CheckCircle,
                            containerColor = CampusM3LightBlue,
                            iconColor = CampusM3DarkBlue,
                            tag = "action_btn_attendance",
                            onClick = { activeQuickAction = "attendance" }
                        )
                    }
                }
            }
        }

        // 3. Stats Section / Dynamic visualizer
        item {
            Text(
                text = "CURRENT PERFORMANCE",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = CampusM3PrimaryPurple,
                    letterSpacing = 1.2.sp
                ),
                modifier = Modifier.padding(top = 4.dp, bottom = 4.dp, start = 4.dp)
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Attendance percentage card
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .border(1.dp, CampusM3Border, RoundedCornerShape(16.dp))
                        .padding(12.dp)
                ) {
                    Column(verticalArrangement = Arrangement.SpaceBetween) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .background(CampusM3PrimaryPurple, CircleShape)
                            )
                            Text(
                                text = "ATTENDANCE",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = CampusM3BodyGray,
                                letterSpacing = 0.5.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = String.format("%.1f%%", student.attendancePercentage),
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Light,
                            color = CampusM3DarkText
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (student.attendancePercentage >= 75) "↑ Satisfies 75% Criteria" else "⚠ Detained Risk (<75%)",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = if (student.attendancePercentage >= 75) Color(0xFF2E7D32) else CampusM3ErrorRed
                        )
                    }
                }

                // Balance / Dues Card
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .border(1.dp, CampusM3Border, RoundedCornerShape(16.dp))
                        .padding(12.dp)
                ) {
                    Column(verticalArrangement = Arrangement.SpaceBetween) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            Box(
                                modifier = Modifier
                                    .size(8.dp)
                                    .background(
                                        if (student.pendingFees > 0) CampusM3ErrorRed else Color(0xFF2E7D32),
                                        CircleShape
                                    )
                            )
                            Text(
                                text = "PENDING FEES",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = CampusM3BodyGray,
                                letterSpacing = 0.5.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = if (student.pendingFees > 0) String.format("₹%,.0f", student.pendingFees) else "₹0",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Light,
                            color = CampusM3DarkText
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (student.pendingFees > 0) "Pay tuition invoices" else "All dues cleared ✓",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Medium,
                            color = if (student.pendingFees > 0) CampusM3BodyGray else Color(0xFF2E7D32)
                        )
                    }
                }
            }
        }

        // 4. Upcoming Schedules & Activities Card
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CampusM3GraySurface, RoundedCornerShape(20.dp))
                    .padding(14.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .background(Color.White, CircleShape)
                            .border(1.dp, CampusM3Border, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Schedule,
                            contentDescription = "Event Schedule",
                            tint = CampusM3PrimaryPurple
                        )
                    }
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = "UPCOMING CAMPUS EVENT",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3BodyGray,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = getDynamicEventName(student.department),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DarkText
                        )
                        Text(
                            text = "Tomorrow • 10:30 AM • Seminar Hall B4",
                            fontSize = 10.sp,
                            color = CampusM3BodyGray
                        )
                    }
                }
            }
        }

        // Quick tip regarding dynamic security
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF7E6)),
                border = BorderStroke(1.dp, Color(0xFFFFD591)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(10.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "Security Status",
                        tint = Color(0xFFD46B08),
                        modifier = Modifier.size(18.dp)
                    )
                    Text(
                        text = "ID token is cryptographically rotated on-device every 30s to prevent tap-cloning and unauthorized campus entrance checks.",
                        fontSize = 10.sp,
                        color = Color(0xFF873800),
                        lineHeight = 13.sp
                    )
                }
            }
        }
    }

    // --- Action Overlays (Model Dialogs with precise form states) ---

    when (activeQuickAction) {
        "admission" -> {
            AdmissionOverlay(
                viewModel = viewModel,
                onDismiss = { activeQuickAction = null }
            )
        }
        "exam" -> {
            ExamRegistrationOverlay(
                viewModel = viewModel,
                onDismiss = { activeQuickAction = null }
            )
        }
        "payment" -> {
            PaymentsOverlay(
                viewModel = viewModel,
                onDismiss = { activeQuickAction = null }
            )
        }
        "attendance" -> {
            AttendanceOverlay(
                viewModel = viewModel,
                onDismiss = { activeQuickAction = null }
            )
        }
    }
}

/**
 * 1. High Density Digital ID Card
 */
@Composable
fun DigitalIdCard(
    student: Student,
    qrToken: String,
    qrTimeLeft: Int,
    onWalletClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .shadow(4.dp, RoundedCornerShape(24.dp))
            .background(
                brush = Brush.linearGradient(
                    colors = listOf(CampusM3PurpleContainer, CampusM3GradientEnd)
                ),
                shape = RoundedCornerShape(24.dp)
            )
            .padding(16.dp)
            .testTag("student_id_card")
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        Text(
                            text = "STUDENT ID",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DeepPurple.copy(alpha = 0.7f),
                            letterSpacing = 1.2.sp
                        )
                        Box(
                            modifier = Modifier
                                .background(
                                    when (student.cardStatus) {
                                        CardStatus.ISSUED -> Color(0xFF2E7D32)
                                        CardStatus.PENDING -> Color(0xFFE65100)
                                        CardStatus.APPROVED -> Color(0xFF0277BD)
                                        CardStatus.SUSPENDED -> CampusM3ErrorRed
                                        else -> CampusM3BodyGray
                                    },
                                    RoundedCornerShape(4.dp)
                                )
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = student.cardStatus.name,
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = student.fullName,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = CampusM3DeepPurple,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "${student.course} • ${student.department} • Sem ${student.semester}",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        color = CampusM3DeepPurple.copy(alpha = 0.8f),
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                // Barcode / Dynamic Secure QR Simulation
                Spacer(modifier = Modifier.width(8.dp))
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(4.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(72.dp)
                            .background(Color.White, RoundedCornerShape(12.dp))
                            .padding(6.dp)
                    ) {
                        if (student.cardStatus == CardStatus.ISSUED) {
                            QRMatrixDraw(token = qrToken)
                        } else {
                            // Empty or locked QR state representation
                            Box(
                                modifier = Modifier.fillMaxSize(),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Lock,
                                    contentDescription = "ID Locked",
                                    tint = CampusM3Border,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }
                    }
                    if (student.cardStatus == CardStatus.ISSUED) {
                        Text(
                            text = "Rotates in: ${qrTimeLeft}s",
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DeepPurple
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Lower Detail Row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, CampusM3DeepPurple.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                    .background(Color.White.copy(alpha = 0.25f), RoundedCornerShape(12.dp))
                    .padding(8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "ROLL NUMBER",
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold,
                        color = CampusM3DeepPurple.copy(alpha = 0.6f)
                    )
                    Text(
                        text = student.rollNumber,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = CampusM3DeepPurple
                    )
                }

                Box(modifier = Modifier
                    .width(1.dp)
                    .height(20.dp)
                    .background(CampusM3DeepPurple.copy(alpha = 0.2f)))

                Column(
                    modifier = Modifier.clickable { onWalletClick() }
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = "WALLET BALANCE",
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DeepPurple.copy(alpha = 0.6f)
                        )
                        Icon(
                            imageVector = Icons.Default.AddCircle,
                            contentDescription = "Top up wallet",
                            tint = CampusM3DeepPurple,
                            modifier = Modifier.size(10.dp)
                        )
                    }
                    Text(
                        text = String.format("₹%,.2f", student.walletBalance),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = CampusM3DeepPurple
                    )
                }

                Box(modifier = Modifier
                    .width(1.dp)
                    .height(20.dp)
                    .background(CampusM3DeepPurple.copy(alpha = 0.2f)))

                Box(
                    modifier = Modifier
                        .background(CampusM3DeepPurple, RoundedCornerShape(50.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "VAL: ${student.cardExpiresAt ?: "06/2028"}",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }
    }
}

/**
 * 2. Canvas-drawn secure QR Matrix code simulation
 */
@Composable
fun QRMatrixDraw(token: String) {
    val seed = token.hashCode()
    Canvas(modifier = Modifier.fillMaxSize()) {
        val rows = 12
        val cols = 12
        val blockWidth = size.width / cols
        val blockHeight = size.height / rows
        val random = Random(seed.toLong())

        for (r in 0 until rows) {
            for (c in 0 until cols) {
                // Draw rigid custom alignment markers first to look like a realistic QR code
                val isFinderPattern = (r < 3 && c < 3) || (r < 3 && c >= cols - 3) || (r >= rows - 3 && c < 3)
                if (isFinderPattern) {
                    // Outer border block of finder pattern
                    val isBorder = r == 0 || r == 2 || c == 0 || c == 2 || r == rows - 1 || r == rows - 3 || c == cols - 1 || c == cols - 3 || (r < 3 && c == cols - 1) || (r < 3 && c == cols - 3)
                    if (isBorder) {
                        drawRect(
                            color = Color.Black,
                            topLeft = Offset(c * blockWidth, r * blockHeight),
                            size = Size(blockWidth, blockHeight)
                        )
                    } else if (r == 1 && c == 1 || (r == 1 && c == cols - 2) || (r == rows - 2 && c == 1)) {
                        drawRect(
                            color = Color.Black,
                            topLeft = Offset(c * blockWidth, r * blockHeight),
                            size = Size(blockWidth, blockHeight)
                        )
                    }
                } else {
                    // Random matrix generation based on hash seed
                    if (random.nextBoolean()) {
                        drawRect(
                            color = Color.Black,
                            topLeft = Offset(c * blockWidth, r * blockHeight),
                            size = Size(blockWidth, blockHeight)
                        )
                    }
                }
            }
        }
    }
}

/**
 * Quick Action Item button
 */
@Composable
fun QuickActionItem(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    containerColor: Color,
    iconColor: Color,
    tag: String,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable { onClick() }
            .testTag(tag)
            .padding(4.dp)
    ) {
        Box(
            modifier = Modifier
                .size(54.dp)
                .background(containerColor, RoundedCornerShape(16.dp))
                .clickable { onClick() },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = iconColor,
                modifier = Modifier.size(24.dp)
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = title,
            fontSize = 10.sp,
            fontWeight = FontWeight.Medium,
            color = CampusM3BodyGray,
            textAlign = TextAlign.Center,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

/**
 * Custom function to helper render student department specific event text
 */
fun getDynamicEventName(dept: String): String {
    return when {
        dept.contains("Computer Science") -> "Main Exam: Systems Programming & OS"
        dept.contains("Electronics") -> "Semtech: Digital Signal Processing"
        dept.contains("Management") -> "Workshop: Corporate Strategy Planning"
        else -> "Lecture: Applied Science & Eng Module"
    }
}


// ==========================================
// ACTION MODAL OVERLAYS (Full robust states)
// ==========================================

/**
 * 1. Admission Form & Application Tracker
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdmissionOverlay(viewModel: CampusViewModel, onDismiss: () -> Unit) {
    val applications by viewModel.applications.collectAsState()
    val activeStudent by viewModel.activeStudent.collectAsState()

    var activeTab by remember { mutableStateOf(0) } // 0: Application Status, 1: Submit Form

    // Form inputs state
    var entryName by remember { mutableStateOf(activeStudent?.fullName ?: "") }
    var entryEmail by remember { mutableStateOf(activeStudent?.email ?: "") }
    var entryPhone by remember { mutableStateOf(activeStudent?.phone ?: "") }
    var entryCourse by remember { mutableStateOf("B.Tech") }
    var entryDept by remember { mutableStateOf("Computer Science and Engineering") }
    var entranceHighschool by remember { mutableStateOf("") }
    var entranceIntermediate by remember { mutableStateOf("") }
    var submissionSuccess by remember { mutableStateOf(false) }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "ADMISSION CELL",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = CampusM3PrimaryPurple
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                    }
                }

                // Mini Tab Controller
                TabRow(
                    selectedTabIndex = activeTab,
                    containerColor = Color.Transparent,
                    contentColor = CampusM3PrimaryPurple,
                    modifier = Modifier.padding(vertical = 8.dp)
                ) {
                    Tab(
                        selected = activeTab == 0,
                        onClick = { activeTab = 0 },
                        text = { Text("Track status", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = activeTab == 1,
                        onClick = { activeTab = 1 },
                        text = { Text("New application", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                if (activeTab == 0) {
                    // Track Application
                    LazyColumn(
                        modifier = Modifier.weight(1f),
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(applications) { app ->
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(CampusM3GraySurface, RoundedCornerShape(14.dp))
                                    .border(1.dp, CampusM3Border, RoundedCornerShape(14.dp))
                                    .padding(12.dp)
                            ) {
                                Column {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = "App: ${app.applicationNumber}",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = CampusM3DarkText
                                        )
                                        Box(
                                            modifier = Modifier
                                                .background(
                                                    when (app.status) {
                                                        ApplicationStatus.APPROVED -> Color(0xFF2E7D32)
                                                        ApplicationStatus.UNDER_REVIEW -> Color(0xFFE65100)
                                                        ApplicationStatus.SUBMITTED -> Color(0xFF0277BD)
                                                        else -> CampusM3ErrorRed
                                                    },
                                                    RoundedCornerShape(6.dp)
                                                )
                                                .padding(horizontal = 8.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = app.status.name,
                                                fontSize = 8.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = Color.White
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = "${app.fullName} • ${app.course}",
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                    Text(
                                        text = app.department,
                                        fontSize = 11.sp,
                                        color = CampusM3BodyGray
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(
                                            text = "Fee Payment: ${app.paymentStatus.name}",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = if (app.paymentStatus == PaymentStatus.SUCCESS) Color(0xFF2E7D32) else CampusM3ErrorRed
                                        )
                                        if (app.paymentStatus == PaymentStatus.PENDING) {
                                            Button(
                                                onClick = {
                                                    viewModel.payApplicationFee(app.id, app.feePaid, "RAZORPAY")
                                                },
                                                colors = ButtonDefaults.buttonColors(containerColor = CampusM3PrimaryPurple),
                                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                                modifier = Modifier.height(26.dp)
                                            ) {
                                                Text("Pay ₹500", fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // Application Entry Form
                    if (submissionSuccess) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth(),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(
                                    imageVector = Icons.Default.CheckCircle,
                                    contentDescription = "Success",
                                    tint = Color(0xFF2E7D32),
                                    modifier = Modifier.size(54.dp)
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Text(
                                    text = "Admission Registered!",
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "Please track status on the left panel.",
                                    fontSize = 11.sp,
                                    color = CampusM3BodyGray
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                Button(onClick = {
                                    submissionSuccess = false
                                    activeTab = 0
                                }) {
                                    Text("Done", fontSize = 11.sp)
                                }
                            }
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.weight(1f),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            item {
                                OutlinedTextField(
                                    value = entryName,
                                    onValueChange = { entryName = it },
                                    label = { Text("Full Name", fontSize = 11.sp) },
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = entryEmail,
                                    onValueChange = { entryEmail = it },
                                    label = { Text("Email", fontSize = 11.sp) },
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = entryPhone,
                                    onValueChange = { entryPhone = it },
                                    label = { Text("Phone Number", fontSize = 11.sp) },
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = entranceHighschool,
                                    onValueChange = { entranceHighschool = it },
                                    label = { Text("High School Marks (%)", fontSize = 11.sp) },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                OutlinedTextField(
                                    value = entranceIntermediate,
                                    onValueChange = { entranceIntermediate = it },
                                    label = { Text("Intermediate Marks (%)", fontSize = 11.sp) },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                            item {
                                Button(
                                    onClick = {
                                        if (entryName.isNotBlank() && entryEmail.isNotBlank()) {
                                            val appObj = AdmissionApplication(
                                                id = "app-${(100..999).random()}",
                                                applicationNumber = "APP2025${(1000..9999).random()}",
                                                studentId = activeStudent?.id,
                                                fullName = entryName,
                                                email = entryEmail,
                                                phone = entryPhone,
                                                course = entryCourse,
                                                department = entryDept,
                                                dob = "2007-10-10",
                                                gender = "Male",
                                                category = "General",
                                                bloodGroup = "O+",
                                                guardianName = "Guardian Father",
                                                guardianPhone = "9112233445",
                                                address = "Campus Lane 2",
                                                city = "Delhi",
                                                state = "Delhi",
                                                pincode = "110012",
                                                highSchoolMarks = entranceHighschool.toDoubleOrNull() ?: 85.0,
                                                intermediateMarks = entranceIntermediate.toDoubleOrNull() ?: 83.0,
                                                status = ApplicationStatus.SUBMITTED,
                                                paymentStatus = PaymentStatus.PENDING
                                            )
                                            viewModel.submitAdmissionApplication(appObj)
                                            submissionSuccess = true
                                        }
                                    },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(top = 10.dp)
                                ) {
                                    Text("Submit Application", fontSize = 12.sp)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * 2. Exam Form Registration and Admit Cards Panel
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ExamRegistrationOverlay(viewModel: CampusViewModel, onDismiss: () -> Unit) {
    val activeStudent by viewModel.activeStudent.collectAsState()
    val examForms by viewModel.examForms.collectAsState()
    val admitCards by viewModel.admitCards.collectAsState()

    var activeTab by remember { mutableStateOf(0) } // 0: Form Registration, 1: Admit Cards

    // Subjects configuration based on student departments
    val CS_SUBJECTS = listOf(
        "CS401: Operating Systems",
        "CS402: Database Management Systems",
        "CS403: Computer Networks",
        "MA401: Discrete Mathematics"
    )
    val ME_SUBJECTS = listOf(
        "ME601: Thermodynamics II",
        "ME602: Fluid Mechanics II",
        "ME603: Fluid Machinery Laboratory",
        "MH611: Kinematics of Machines"
    )
    val MBA_SUBJECTS = listOf(
        "MGT401: Strategic Corporate Governance",
        "MGT402: Microeconomics Principles",
        "MGT403: Brand Equity Dynamics",
        "MGT404: Operational Research Optimization"
    )

    val currentStudent = activeStudent ?: return
    val subjectsList = when {
        currentStudent.department.contains("Computer Science") -> CS_SUBJECTS
        currentStudent.department.contains("Mechanical") -> ME_SUBJECTS
        else -> MBA_SUBJECTS
    }

    val selectedSubjects = remember { mutableStateListOf<String>().apply { addAll(subjectsList) } }
    var backlogRegister by remember { mutableStateOf(false) }
    var selectedBacklogs = remember { mutableStateListOf<String>() }

    // Check if there is already an active exam form for this register
    val existingForm = examForms.firstOrNull { it.studentId == currentStudent.id && it.semester == currentStudent.semester }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "EXAM WORKSPACE",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = CampusM3PrimaryPurple
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                    }
                }

                TabRow(
                    selectedTabIndex = activeTab,
                    containerColor = Color.Transparent,
                    contentColor = CampusM3PrimaryPurple,
                    modifier = Modifier.padding(vertical = 4.dp)
                ) {
                    Tab(
                        selected = activeTab == 0,
                        onClick = { activeTab = 0 },
                        text = { Text("Registration", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                    Tab(
                        selected = activeTab == 1,
                        onClick = { activeTab = 1 },
                        text = { Text("Admit Cards", fontSize = 11.sp, fontWeight = FontWeight.Bold) }
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                if (activeTab == 0) {
                    // Registration page
                    if (existingForm != null) {
                        // Display status of registration
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth(),
                            contentAlignment = Alignment.TopStart
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(CampusM3GraySurface, RoundedCornerShape(16.dp))
                                    .padding(14.dp)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = "Semester ${existingForm.semester} Registration",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp
                                    )
                                    Box(
                                        modifier = Modifier
                                            .background(
                                                if (existingForm.status == ExamFormStatus.PAID) Color(0xFF2E7D32) else Color(0xFFE65100),
                                                RoundedCornerShape(6.dp)
                                            )
                                            .padding(horizontal = 8.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = existingForm.status.name,
                                            fontSize = 8.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color.White
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(text = "Subjects:", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                existingForm.subjects.forEach { sub ->
                                    Text(text = "• $sub", fontSize = 11.sp, color = CampusM3BodyGray)
                                }
                                if (existingForm.isBacklog) {
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(text = "Backlogs registered:", fontSize = 11.sp, color = CampusM3ErrorRed, fontWeight = FontWeight.Bold)
                                    existingForm.backlogSubjects.forEach { sub ->
                                        Text(text = "• $sub", fontSize = 11.sp, color = CampusM3ErrorRed)
                                    }
                                }

                                Spacer(modifier = Modifier.height(14.dp))
                                Divider()
                                Spacer(modifier = Modifier.height(14.dp))

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(text = "Fee Invoice", fontSize = 10.sp, color = CampusM3BodyGray)
                                        Text(
                                            text = String.format("₹%,.2f", existingForm.examFee),
                                            fontSize = 18.sp,
                                            fontWeight = FontWeight.Bold
                                        )
                                    }

                                    if (existingForm.status == ExamFormStatus.SUBMITTED) {
                                        Button(
                                            onClick = {
                                                viewModel.payExamForm(
                                                    existingForm.id,
                                                    currentStudent.id,
                                                    existingForm.examFee,
                                                    "WALLET"
                                                )
                                            },
                                            modifier = Modifier.testTag("pay_exam_fee_btn")
                                        ) {
                                            Text("Pay with Wallet", fontSize = 11.sp)
                                        }
                                    } else {
                                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                            Icon(imageVector = Icons.Default.Check, contentDescription = "Paid", tint = Color(0xFF2E7D32))
                                            Text("Registration Verified", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF2E7D32))
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        // Submit new Form
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Register for semester ${currentStudent.semester} exams:",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = CampusM3BodyGray
                            )
                            Spacer(modifier = Modifier.height(6.dp))

                            LazyColumn(
                                modifier = Modifier.weight(1f),
                                verticalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                items(subjectsList) { s ->
                                    val checked = selectedSubjects.contains(s)
                                    Row(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clickable {
                                                if (checked) selectedSubjects.remove(s) else selectedSubjects.add(s)
                                            },
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Checkbox(
                                            checked = checked,
                                            onCheckedChange = {
                                                if (checked) selectedSubjects.remove(s) else selectedSubjects.add(s)
                                            }
                                        )
                                        Text(text = s, fontSize = 11.sp)
                                    }
                                }

                                item {
                                    Spacer(modifier = Modifier.height(10.dp))
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Switch(
                                            checked = backlogRegister,
                                            onCheckedChange = { backlogRegister = it }
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text("Register backlog subjects?", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    }
                                }

                                if (backlogRegister) {
                                    item {
                                        OutlinedTextField(
                                            value = if (selectedBacklogs.isEmpty()) "" else selectedBacklogs.joinToString(", "),
                                            onValueChange = {
                                                selectedBacklogs.clear()
                                                if (it.isNotBlank()) {
                                                    selectedBacklogs.add(it)
                                                }
                                            },
                                            label = { Text("Type backlog subjects (comma separated)", fontSize = 10.sp) },
                                            modifier = Modifier.fillMaxWidth()
                                        )
                                    }
                                }
                            }

                            Button(
                                onClick = {
                                    val fee = 500.0 + (if (backlogRegister) 800.0 else 0.0)
                                    viewModel.submitExamForm(
                                        currentStudent.id,
                                        currentStudent.semester,
                                        selectedSubjects.toList(),
                                        backlogRegister,
                                        selectedBacklogs.toList(),
                                        fee
                                    )
                                },
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Register & Generate Invoice", fontSize = 11.sp)
                            }
                        }
                    }
                } else {
                    // Admit Card listing
                    val activeAdmitCards = admitCards.filter { it.studentId == currentStudent.id }

                    if (activeAdmitCards.isEmpty()) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxWidth(),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(
                                    imageVector = Icons.Outlined.Lock,
                                    contentDescription = "No admit card",
                                    tint = CampusM3Border,
                                    modifier = Modifier.size(50.dp)
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                Text(
                                    text = "No Released Hall Tickets",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = "Make sure your exam fees are paid to generate your card.",
                                    fontSize = 10.sp,
                                    color = CampusM3BodyGray,
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                    } else {
                        LazyColumn(
                            modifier = Modifier.weight(1f),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(activeAdmitCards) { card ->
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .border(2.dp, CampusM3PrimaryPurple, RoundedCornerShape(16.dp))
                                        .background(CampusM3PurpleContainer.copy(alpha = 0.2f), RoundedCornerShape(16.dp))
                                        .padding(14.dp)
                                ) {
                                    Column {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = "OFFICIAL ADMIT CARD",
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.ExtraBold,
                                                color = CampusM3PrimaryPurple,
                                                letterSpacing = 1.sp
                                            )
                                            Box(
                                                modifier = Modifier
                                                    .background(Color(0xFF2E7D32), RoundedCornerShape(4.dp))
                                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                                            ) {
                                                Text("RELEASED", fontSize = 7.sp, color = Color.White, fontWeight = FontWeight.Bold)
                                            }
                                        }
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text(text = currentStudent.fullName, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                                        Text(
                                            text = "Roll: ${card.rollNumber} • Sem ${card.semester}",
                                            fontSize = 11.sp,
                                            color = CampusM3BodyGray
                                        )
                                        Text(
                                            text = "Center: ${card.examCenter}",
                                            fontSize = 11.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = CampusM3DarkText
                                        )

                                        Spacer(modifier = Modifier.height(10.dp))
                                        // Visual signature verification
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Box(
                                                modifier = Modifier
                                                    .size(44.dp)
                                                    .background(Color.White)
                                                    .border(1.dp, CampusM3Border)
                                                    .padding(3.dp)
                                            ) {
                                                QRMatrixDraw(token = card.qrCodeData) // Secure verification QR
                                            }
                                            Column(horizontalAlignment = Alignment.End) {
                                                Text(
                                                    text = "/s/ Controller of Exams",
                                                    fontSize = 9.sp,
                                                    fontFamily = FontFamily.Cursive,
                                                    fontWeight = FontWeight.Bold,
                                                    color = CampusM3DeepPurple
                                                )
                                                Text(text = "Security Validated ✓", fontSize = 8.sp, color = Color(0xFF2E7D32))
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * 3. Payments Workspace: Razorpay / Stripe simulator & transactions list
 */
@Composable
fun PaymentsOverlay(viewModel: CampusViewModel, onDismiss: () -> Unit) {
    val activeStudent by viewModel.activeStudent.collectAsState()
    val payments by viewModel.payments.collectAsState()

    var billingAmount by remember { mutableStateOf("") }
    var invoicePurpose by remember { mutableStateOf("ACADEMIC_TUITION_FEE") }
    var selectedGateway by remember { mutableStateOf("WALLET") } // WALLET, STRIPE, RAZORPAY

    val student = activeStudent ?: return
    val studentPayments = payments.filter { it.studentId == student.id }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "PAYMENT PORTAL",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = CampusM3PrimaryPurple
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                    }
                }

                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Wallet Balance Summary Card
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(CampusM3PurpleContainer, RoundedCornerShape(16.dp))
                                .padding(14.dp)
                        ) {
                            Column {
                                Text(
                                    text = "YOUR WALLET BALANCE",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = CampusM3DeepPurple,
                                    letterSpacing = 1.sp
                                )
                                Text(
                                    text = String.format("₹%,.2f", student.walletBalance),
                                    fontSize = 24.sp,
                                    fontWeight = FontWeight.Black,
                                    color = CampusM3DeepPurple
                                )
                                Spacer(modifier = Modifier.height(10.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                                ) {
                                    // Add Fund button
                                    Button(
                                        onClick = { viewModel.topUpWallet(student.id, 1000.0) },
                                        colors = ButtonDefaults.buttonColors(containerColor = CampusM3DeepPurple),
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                                        modifier = Modifier.height(30.dp)
                                    ) {
                                        Text("Top Up +₹1000", fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                    Button(
                                        onClick = { viewModel.topUpWallet(student.id, 5000.0) },
                                        colors = ButtonDefaults.buttonColors(containerColor = CampusM3DeepPurple),
                                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp),
                                        modifier = Modifier.height(30.dp)
                                    ) {
                                        Text("+₹5000", fontSize = 9.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }

                    // Direct payment constructor form
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, CampusM3Border, RoundedCornerShape(14.dp))
                                .padding(12.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                Text(
                                    text = "PAY CAMPUS INVOICES",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = CampusM3PrimaryPurple
                                )

                                OutlinedTextField(
                                    value = billingAmount,
                                    onValueChange = { billingAmount = it },
                                    label = { Text("Amount (INR)", fontSize = 11.sp) },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.fillMaxWidth()
                                )

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("Gateway:", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    RadioButton(selected = selectedGateway == "WALLET", onClick = { selectedGateway = "WALLET" })
                                    Text("Wallet", fontSize = 10.sp)
                                    RadioButton(selected = selectedGateway == "STRIPE", onClick = { selectedGateway = "STRIPE" })
                                    Text("Stripe", fontSize = 10.sp)
                                    RadioButton(selected = selectedGateway == "RAZORPAY", onClick = { selectedGateway = "RAZORPAY" })
                                    Text("Razorpay", fontSize = 10.sp)
                                }

                                Button(
                                    onClick = {
                                        val amt = billingAmount.toDoubleOrNull()
                                        if (amt != null && amt > 0) {
                                            viewModel.payInvoice(student.id, amt, invoicePurpose, selectedGateway)
                                            billingAmount = ""
                                        }
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    enabled = billingAmount.isNotBlank()
                                ) {
                                    Text("Simulate Payment", fontSize = 11.sp)
                                }
                            }
                        }
                    }

                    // Payment History lists
                    item {
                        Text(
                            text = "TRANSACTION HISTORY",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3PrimaryPurple,
                            letterSpacing = 0.5.sp
                        )
                    }

                    if (studentPayments.isEmpty()) {
                        item {
                            Text(
                                "No transactions recorded.",
                                fontSize = 11.sp,
                                color = CampusM3BodyGray,
                                modifier = Modifier.fillMaxWidth(),
                                textAlign = TextAlign.Center
                            )
                        }
                    } else {
                        items(studentPayments) { p ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(CampusM3GraySurface, RoundedCornerShape(10.dp))
                                    .padding(10.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(text = p.purpose, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                    Text(text = "ID: ${p.transactionId}", fontSize = 8.sp, color = CampusM3BodyGray)
                                    Text(text = p.paymentGateway, fontSize = 9.sp, fontWeight = FontWeight.Medium, color = CampusM3PrimaryPurple)
                                }
                                Text(
                                    text = String.format("₹%,.2f", p.amount),
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (p.purpose == "WALLET_TOP_UP") Color(0xFF2E7D32) else CampusM3DarkText
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * 4. Attendance Check-in Panel (QR barcode Scanner simulation, Biometrics & Geofence)
 */
@Composable
fun AttendanceOverlay(viewModel: CampusViewModel, onDismiss: () -> Unit) {
    val activeStudent by viewModel.activeStudent.collectAsState()
    val attendanceRecords by viewModel.attendanceRecords.collectAsState()

    val currentStudent = activeStudent ?: return
    val studentAttendance = attendanceRecords.filter { it.studentId == currentStudent.id }

    var checkInMethod by remember { mutableStateOf(AttendanceMethod.QR_SCAN) }
    var biometricFeedbackMessage by remember { mutableStateOf("") }
    var geofenceMessage by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .fillMaxHeight(0.85f),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "ATTENDANCE TERMINAL",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = CampusM3PrimaryPurple
                    )
                    IconButton(onClick = onDismiss) {
                        Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                    }
                }

                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    item {
                        Text(
                            text = "CHOOSE SCAN METHOD",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3PrimaryPurple,
                            letterSpacing = 0.5.sp
                        )
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Button(
                                onClick = { checkInMethod = AttendanceMethod.QR_SCAN },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (checkInMethod == AttendanceMethod.QR_SCAN) CampusM3PrimaryPurple else CampusM3GraySurface,
                                    contentColor = if (checkInMethod == AttendanceMethod.QR_SCAN) Color.White else CampusM3DarkText
                                ),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 8.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .padding(2.dp)
                                    .height(32.dp)
                            ) {
                                Text("QR Code", fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                            Button(
                                onClick = { checkInMethod = AttendanceMethod.BIOMETRIC },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (checkInMethod == AttendanceMethod.BIOMETRIC) CampusM3PrimaryPurple else CampusM3GraySurface,
                                    contentColor = if (checkInMethod == AttendanceMethod.BIOMETRIC) Color.White else CampusM3DarkText
                                ),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 8.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .padding(2.dp)
                                    .height(32.dp)
                            ) {
                                Text("Biometric", fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                            Button(
                                onClick = { checkInMethod = AttendanceMethod.GEOFENCE },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (checkInMethod == AttendanceMethod.GEOFENCE) CampusM3PrimaryPurple else CampusM3GraySurface,
                                    contentColor = if (checkInMethod == AttendanceMethod.GEOFENCE) Color.White else CampusM3DarkText
                                ),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 8.dp),
                                modifier = Modifier
                                    .weight(1f)
                                    .padding(2.dp)
                                    .height(32.dp)
                            ) {
                                Text("Geofence", fontSize = 9.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    // Main interactive section based on method
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .border(1.dp, CampusM3Border, RoundedCornerShape(16.dp))
                                .padding(14.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            when (checkInMethod) {
                                AttendanceMethod.QR_SCAN -> {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text(text = "Scan Campus Entry QR Scanner", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        Spacer(modifier = Modifier.height(10.dp))
                                        Box(
                                            modifier = Modifier
                                                .size(100.dp)
                                                .border(2.dp, CampusM3PrimaryPurple, RoundedCornerShape(8.dp))
                                                .padding(6.dp)
                                        ) {
                                            QRMatrixDraw(token = "CAMPUS-Scanner-Entry-Gate")
                                        }
                                        Spacer(modifier = Modifier.height(12.dp))
                                        Button(
                                            onClick = {
                                                viewModel.checkInAttendance(currentStudent.id, AttendanceMethod.QR_SCAN, "Main Gate Terminal A")
                                            },
                                            modifier = Modifier.testTag("qr_scan_sim_btn")
                                        ) {
                                            Text("Simulate Scanning Gate QR", fontSize = 10.sp)
                                        }
                                    }
                                }
                                AttendanceMethod.BIOMETRIC -> {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text(text = "On-Device Biometric Verification", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        Spacer(modifier = Modifier.height(14.dp))
                                        IconButton(
                                            onClick = {
                                                viewModel.checkInAttendance(currentStudent.id, AttendanceMethod.BIOMETRIC, "Device Fingerprint Scanner")
                                                biometricFeedbackMessage = "Fingerprint Match Verified! Access Logged."
                                            },
                                            modifier = Modifier
                                                .size(64.dp)
                                                .background(CampusM3LightBlue, CircleShape)
                                        ) {
                                            Icon(
                                                imageVector = Icons.Default.Fingerprint,
                                                contentDescription = "Verify Biometric",
                                                tint = CampusM3PrimaryPurple,
                                                modifier = Modifier.size(36.dp)
                                            )
                                        }
                                        Spacer(modifier = Modifier.height(10.dp))
                                        Text(
                                            text = biometricFeedbackMessage.ifBlank { "Tap sensor to log attendance" },
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (biometricFeedbackMessage.isNotBlank()) Color(0xFF2E7D32) else CampusM3BodyGray
                                        )
                                    }
                                }
                                AttendanceMethod.GEOFENCE -> {
                                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                        Text(text = "Verify Precise GPS Location Coordinates", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        Spacer(modifier = Modifier.height(10.dp))
                                        Text(text = "Current Range status: Within Campus bound box (Hauz Khas Delhi)", fontSize = 10.sp, color = Color(0xFF2E7D32), fontWeight = FontWeight.Bold)
                                        Spacer(modifier = Modifier.height(10.dp))
                                        Button(
                                            onClick = {
                                                viewModel.checkInAttendance(currentStudent.id, AttendanceMethod.GEOFENCE, "Campus Geo-fence bounds")
                                                geofenceMessage = "GPS verified inside bounds ✓ Present Logged!"
                                            }
                                        ) {
                                            Text("Verify coordinates", fontSize = 11.sp)
                                        }
                                        if (geofenceMessage.isNotBlank()) {
                                            Text(text = geofenceMessage, fontSize = 9.sp, color = Color(0xFF2E7D32), fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 4.dp))
                                        }
                                    }
                                }
                                else -> {}
                            }
                        }
                    }

                    // Check-out command
                    item {
                        Button(
                            onClick = { viewModel.checkOutAttendance(currentStudent.id) },
                            colors = ButtonDefaults.buttonColors(containerColor = CampusM3ErrorRed),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Simulate Campus Exit / Check-out", fontSize = 11.sp)
                        }
                    }

                    // History registers
                    item {
                        Text(
                            text = "ATTENDANCE SHEET LOGS",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3PrimaryPurple,
                            letterSpacing = 0.5.sp
                        )
                    }

                    if (studentAttendance.isEmpty()) {
                        item {
                            Text(
                                text = "No daily attendance registers found.",
                                fontSize = 11.sp,
                                color = CampusM3BodyGray,
                                modifier = Modifier.fillMaxWidth(),
                                textAlign = TextAlign.Center
                            )
                        }
                    } else {
                        items(studentAttendance) { item ->
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(CampusM3GraySurface, RoundedCornerShape(10.dp))
                                    .padding(10.dp)
                            ) {
                                Column {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Text(text = item.dateString, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        Box(
                                            modifier = Modifier
                                                .background(Color(0xFF2E7D32), RoundedCornerShape(4.dp))
                                                .padding(horizontal = 6.dp, vertical = 2.dp)
                                        ) {
                                            Text(text = item.status, fontSize = 8.sp, color = Color.White, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Text(
                                        text = "Check in: ${item.checkedInAt ?: "N/A"}" + if (item.checkedOutAt != null) " • Check out: ${item.checkedOutAt}" else "",
                                        fontSize = 10.sp,
                                        color = CampusM3BodyGray
                                    )
                                    Text(text = "Gate: ${item.location ?: "Default gate"} • Verified via ${item.method.name}", fontSize = 9.sp, color = CampusM3PrimaryPurple)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
