package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.model.CardStatus
import com.example.model.Student
import com.example.ui.theme.*
import com.example.viewmodel.CampusViewModel

@Composable
fun AccountScreen(
    viewModel: CampusViewModel,
    modifier: Modifier = Modifier
) {
    val activeStudent by viewModel.activeStudent.collectAsState()

    val student = activeStudent ?: return

    var editMode by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(CampusBackground)
            .padding(horizontal = 14.dp)
            .testTag("account_screen"),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(top = 10.dp, bottom = 24.dp)
    ) {
        // 1. Digital Profile Header Avatar
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = CampusM3PurpleContainer),
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .background(CampusM3DeepPurple, CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = student.fullName.split(" ").mapNotNull { it.firstOrNull() }.joinToString("").uppercase(),
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }

                    Column {
                        Text(
                            text = student.fullName,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DeepPurple
                        )
                        Text(
                            text = "${student.studentId} • Batch ${student.batch}",
                            fontSize = 11.sp,
                            color = CampusM3DeepPurple.copy(alpha = 0.8f)
                        )
                        Text(
                            text = "Course: ${student.course} (${student.department})",
                            fontSize = 11.sp,
                            color = CampusM3DeepPurple.copy(alpha = 0.8f)
                        )
                    }
                }
            }
        }

        // 2. Academic Summary / Transcripts panel
        item {
            Text(
                text = "CAMPUS TRANSCRIPT DETAILS",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = CampusM3PrimaryPurple,
                    letterSpacing = 1.sp
                )
            )
            Spacer(modifier = Modifier.height(4.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White, RoundedCornerShape(16.dp))
                    .border(1.dp, CampusM3Border, RoundedCornerShape(16.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        TranscriptField(label = "Primary Roll Number", value = student.rollNumber)
                        TranscriptField(label = "Academic Year", value = student.batch.split("-").first().toInt().let { "Year ${student.year} (Sem ${student.semester})" })
                    }
                    Divider()
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        TranscriptField(label = "DOB & Age", value = "${student.dob} (21 yrs)")
                        TranscriptField(label = "Blood Group", value = student.bloodGroup)
                    }
                    Divider()
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        TranscriptField(label = "Category Group", value = student.category)
                        TranscriptField(label = "Phone Contact", value = student.phone)
                    }
                    Divider()
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        TranscriptField(label = "Personal Email", value = student.email)
                        TranscriptField(label = "Postal Address", value = "${student.city}, ${student.state}")
                    }
                }
            }
        }

        // 3. Admin / Test Panel to Toggle / Play with status (extremely useful for showcasing digital ecosystems!)
        item {
            Text(
                text = "ID STATUS ADMIN BENCH",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = CampusM3PrimaryPurple,
                    letterSpacing = 1.sp
                )
            )
            Spacer(modifier = Modifier.height(4.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CampusM3GraySurface, RoundedCornerShape(16.dp))
                    .border(1.dp, CampusM3Border, RoundedCornerShape(16.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Manually override card status below to test visual state feedback loops instantly on the Home Screen card container:",
                        fontSize = 10.sp,
                        color = CampusM3BodyGray,
                        lineHeight = 13.sp
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        // Action: Suspend ID Card
                        Button(
                            onClick = { viewModel.suspendIdCard(student.id) },
                            colors = ButtonDefaults.buttonColors(containerColor = CampusM3ErrorRed),
                            modifier = Modifier
                                .weight(1.5f)
                                .height(32.dp)
                                .testTag("admin_suspend_card"),
                            contentPadding = PaddingValues(horizontal = 6.dp)
                        ) {
                            Text("Suspend Token ⚠", fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }

                        // Action: Approve ID Card (if pending)
                        Button(
                            onClick = { viewModel.approveIdCard(student.id) },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0277BD)),
                            modifier = Modifier
                                .weight(1.5f)
                                .height(32.dp)
                                .testTag("admin_approve_card"),
                            contentPadding = PaddingValues(horizontal = 6.dp)
                        ) {
                            Text("Approve Card ✓", fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }

                        // Action: Reissue ID Card
                        Button(
                            onClick = { viewModel.issueIdCard(student.id) },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                            modifier = Modifier
                                .weight(1.5f)
                                .height(32.dp)
                                .testTag("admin_issue_card"),
                            contentPadding = PaddingValues(horizontal = 6.dp)
                        ) {
                            Text("Issue Card 🗃", fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    // Card request status loop trigger
                    if (student.cardStatus == CardStatus.NOT_APPLIED || student.cardStatus == CardStatus.REJECTED) {
                        Button(
                            onClick = { viewModel.applyForIdCard(student.id) },
                            colors = ButtonDefaults.buttonColors(containerColor = CampusM3PrimaryPurple),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Apply for Digital Campus ID Card Logo", fontSize = 11.sp)
                        }
                    }
                }
            }
        }

        // 4. Guardian Profile / Information summary
        item {
            Text(
                text = "GUARDIAN CONTACT RECORD",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = CampusM3PrimaryPurple,
                    letterSpacing = 1.sp
                )
            )
            Spacer(modifier = Modifier.height(4.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White, RoundedCornerShape(16.dp))
                    .border(1.dp, CampusM3Border, RoundedCornerShape(16.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    TranscriptField(label = "Parent Full Name", value = student.guardianName)
                    Divider()
                    TranscriptField(label = "Parent Phone Number", value = student.guardianPhone)
                    Divider()
                    TranscriptField(label = "Parent Register Email", value = student.guardianEmail)
                }
            }
        }
    }
}

@Composable
fun TranscriptField(label: String, value: String) {
    Column {
        Text(
            text = label.uppercase(),
            fontSize = 7.1.sp,
            fontWeight = FontWeight.Bold,
            color = CampusM3BodyGray,
            letterSpacing = 1.sp
        )
        Text(
            text = value,
            fontSize = 11.1.sp,
            fontWeight = FontWeight.Bold,
            color = CampusM3DarkText
        )
    }
}
