package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
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
import com.example.ui.theme.*
import com.example.viewmodel.CampusViewModel
import kotlinx.coroutines.delay

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ServicesScreen(
    viewModel: CampusViewModel,
    modifier: Modifier = Modifier
) {
    val activeStudent by viewModel.activeStudent.collectAsState()

    var activeSubService by remember { mutableStateOf("hostel") } // "hostel", "bus", "mess"

    // 1. Hostel simulation state
    val totalRooms = 12
    val bookedRooms = remember { mutableStateListOf(1, 4, 7, 10) }
    var selectedRoom by remember { mutableStateOf<Int?>(null) }
    var userBookedRoom by remember { mutableStateOf<Int?>(null) }

    // 2. Bus arrival system countdown
    var busArrivalMin1 by remember { mutableStateOf(4) }
    var busArrivalMin2 by remember { mutableStateOf(11) }
    var busArrivalMin3 by remember { mutableStateOf(23) }

    LaunchedEffect(Unit) {
        while (true) {
            delay(10000) // update countdown timers every 10 seconds
            if (busArrivalMin1 > 1) busArrivalMin1 -= 1 else busArrivalMin1 = 8
            if (busArrivalMin2 > 1) busArrivalMin2 -= 1 else busArrivalMin2 = 14
            if (busArrivalMin3 > 1) busArrivalMin3 -= 1 else busArrivalMin3 = 30
        }
    }

    // 3. Daily Mess Menu
    val messMenu = listOf(
        MessMenuItem("Breakfast (07:30 - 09:30 AM)", "Aloo Paratha, Butter, Curd, Banana, Hot Tea/Coffee", "Rs 45"),
        MessMenuItem("Lunch (12:30 - 02:30 PM)", "Shahi Paneer, Dal Makhani, Zeera Rice, Roti, Salad, Bundi Raita", "Rs 80"),
        MessMenuItem("High Tea (05:00 - 06:15 PM)", "Vegetable Somosa, Chutney, Cookies, Hot Milk Tea", "Rs 30"),
        MessMenuItem("Dinner (07:30 - 09:30 PM)", "Kadgai Chicken (or Veg Palak Paneer), Tandoori Roti, Veg Pulao, Gulab Jamun", "Rs 90")
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(CampusBackground)
            .padding(horizontal = 14.dp)
            .testTag("services_screen")
    ) {
        // Services Selector Header
        Text(
            text = "CAMPUS UTILITY PORTALS",
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = FontWeight.Bold,
                color = CampusM3PrimaryPurple,
                letterSpacing = 1.2.sp
            ),
            modifier = Modifier.padding(top = 12.dp, bottom = 8.dp)
        )

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CampusM3GraySurface, RoundedCornerShape(12.dp))
                .padding(4.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            SubServiceTab(
                label = "Hostel Allocation",
                isSelected = activeSubService == "hostel",
                modifier = Modifier.weight(1f),
                onClick = { activeSubService = "hostel" }
            )
            SubServiceTab(
                label = "Bus Locator",
                isSelected = activeSubService == "bus",
                modifier = Modifier.weight(1f),
                onClick = { activeSubService = "bus" }
            )
            SubServiceTab(
                label = "Daily Mess",
                isSelected = activeSubService == "mess",
                modifier = Modifier.weight(1f),
                onClick = { activeSubService = "mess" }
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Main dynamically toggling viewport
        Box(modifier = Modifier.weight(1f)) {
            when (activeSubService) {
                "hostel" -> {
                    Column(modifier = Modifier.fillMaxSize()) {
                        Text(
                            text = "Hostel Booking Simulator (Block B)",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DarkText
                        )
                        Text(
                            text = "Select a green slot to book your double-sharing room.",
                            fontSize = 10.sp,
                            color = CampusM3BodyGray,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )

                        if (userBookedRoom != null) {
                            Card(
                                colors = CardDefaults.cardColors(containerColor = Color(0xFFF6FFED)),
                                border = BorderStroke(1.dp, Color(0xFFB7EB8F)),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(bottom = 14.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column {
                                        Text(
                                            text = "SUCCESSFULLY ALLOCATED!",
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = Color(0xFF2E7D32)
                                        )
                                        Text(
                                            text = "Room ${userBookedRoom} allocated to ${activeStudent?.fullName}",
                                            fontSize = 12.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = CampusM3DeepPurple
                                        )
                                    }
                                    Button(
                                        onClick = {
                                            bookedRooms.remove(userBookedRoom!!)
                                            userBookedRoom = null
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = CampusM3ErrorRed),
                                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp),
                                        modifier = Modifier.height(28.dp)
                                    ) {
                                        Text("Cancel Booking", fontSize = 9.sp)
                                    }
                                }
                            }
                        }

                        // Room Grid
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                    Box(modifier = Modifier.size(10.dp).background(CampusM3PrimaryPurple, RoundedCornerShape(2.dp)))
                                    Text("Available", fontSize = 9.sp, color = CampusM3BodyGray)
                                    Box(modifier = Modifier.size(10.dp).background(CampusM3Border, RoundedCornerShape(2.dp)))
                                    Text("Occupied", fontSize = 9.sp, color = CampusM3BodyGray)
                                    Box(modifier = Modifier.size(10.dp).background(CampusM3LightBlue, RoundedCornerShape(2.dp)))
                                    Text("Selected", fontSize = 9.sp, color = CampusM3BodyGray)
                                }
                            }
                            Spacer(modifier = Modifier.height(8.dp))

                            // Grid drawing
                            LazyVerticalGrid(
                                columns = GridCells.Fixed(3),
                                verticalArrangement = Arrangement.spacedBy(8.dp),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                items((1..totalRooms).toList()) { num ->
                                    val isOccupied = bookedRooms.contains(num)
                                    val isPickedByMe = selectedRoom == num
                                    val isMyBooking = userBookedRoom == num

                                    Box(
                                        modifier = Modifier
                                            .aspectRatio(1.2f)
                                            .background(
                                                color = when {
                                                    isMyBooking -> Color(0xFFE6FFED)
                                                    isPickedByMe -> CampusM3LightBlue
                                                    isOccupied -> CampusM3GraySurface
                                                    else -> CampusM3PurpleContainer.copy(alpha = 0.5f)
                                                },
                                                shape = RoundedCornerShape(12.dp)
                                            )
                                            .border(
                                                width = if (isPickedByMe) 2.dp else 1.dp,
                                                color = when {
                                                    isMyBooking -> Color(0xFF52C41A)
                                                    isPickedByMe -> CampusM3PrimaryPurple
                                                    isOccupied -> CampusM3Border
                                                    else -> CampusM3PrimaryPurple.copy(alpha = 0.3f)
                                                },
                                                shape = RoundedCornerShape(12.dp)
                                            )
                                            .clickable {
                                                if (!isOccupied && userBookedRoom == null) {
                                                    selectedRoom = if (isPickedByMe) null else num
                                                }
                                            },
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                            Text(
                                                text = "Room ${300 + num}",
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 12.sp,
                                                color = if (isOccupied) CampusM3BodyGray else CampusM3DeepPurple
                                            )
                                            Text(
                                                text = if (isOccupied) "Booked" else "Vacant",
                                                fontSize = 9.sp,
                                                color = if (isOccupied) CampusM3BodyGray else CampusM3PrimaryPurple
                                            )
                                        }
                                    }
                                }
                            }
                        }

                        // Booking button
                        Button(
                            onClick = {
                                if (selectedRoom != null) {
                                    userBookedRoom = selectedRoom
                                    bookedRooms.add(selectedRoom!!)
                                    selectedRoom = null
                                }
                            },
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 12.dp),
                            enabled = selectedRoom != null && userBookedRoom == null
                        ) {
                            Text("Confirm Booking (Charge Room Rent ₹40,000)")
                        }
                    }
                }
                "bus" -> {
                    Column(modifier = Modifier.fillMaxSize()) {
                        Text(
                            text = "Live GPS Campus Bus Tracking",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DarkText
                        )
                        Text(
                            text = "Bus route runs continuously between Metro Station and various campus stops.",
                            fontSize = 10.sp,
                            color = CampusM3BodyGray,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )

                        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            item {
                                BusStatusCard(
                                    busNo = "Bus 1 (IIT Gate Shuttle)",
                                    status = "APPROACHING STOP",
                                    eta = "$busArrivalMin1 mins",
                                    nextStop = "Main Administration Circle stop",
                                    color = Color(0xFFFF9800)
                                )
                            }
                            item {
                                BusStatusCard(
                                    busNo = "Bus 2 (Hostel Ring Shuttle)",
                                    status = "EN ROUTE",
                                    eta = "$busArrivalMin2 mins",
                                    nextStop = "Boys Hostel Block B gate",
                                    color = CampusM3PrimaryPurple
                                )
                            }
                            item {
                                BusStatusCard(
                                    busNo = "Bus 3 (Metropolitan Shuttle)",
                                    status = "EN ROUTE",
                                    eta = "$busArrivalMin3 mins",
                                    nextStop = "Metro Parking Station Drop-off stop",
                                    color = CampusM3PrimaryPurple
                                )
                            }
                        }
                    }
                }
                "mess" -> {
                    Column(modifier = Modifier.fillMaxSize()) {
                        Text(
                            text = "A Hostel Mess Board",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DarkText
                        )
                        Text(
                            text = "Weekly scheduled breakfast, lunch, and dinner menus updated under M3 standards.",
                            fontSize = 10.sp,
                            color = CampusM3BodyGray,
                            modifier = Modifier.padding(bottom = 12.dp)
                        )

                        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            items(messMenu) { item ->
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(Color.White, RoundedCornerShape(14.dp))
                                        .border(1.dp, CampusM3Border, RoundedCornerShape(14.dp))
                                        .padding(12.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.Top
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(
                                                text = item.timeSlot,
                                                fontSize = 11.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = CampusM3PrimaryPurple
                                            )
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(
                                                text = item.menu,
                                                fontSize = 13.sp,
                                                fontWeight = FontWeight.Medium,
                                                color = CampusM3DarkText
                                            )
                                        }
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Box(
                                            modifier = Modifier
                                                .background(CampusM3LightBlue, RoundedCornerShape(50.dp))
                                                .padding(horizontal = 8.dp, vertical = 2.dp)
                                        ) {
                                            Text(
                                                text = item.cost,
                                                fontSize = 9.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = CampusM3DarkBlue
                                            )
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

@Composable
fun SubServiceTab(
    label: String,
    isSelected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .padding(2.dp)
            .background(
                color = if (isSelected) Color.White else Color.Transparent,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable { onClick() }
            .padding(vertical = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            fontSize = 10.sp,
            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
            color = if (isSelected) CampusM3PrimaryPurple else CampusM3BodyGray,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun BusStatusCard(
    busNo: String,
    status: String,
    eta: String,
    nextStop: String,
    color: Color
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White, RoundedCornerShape(16.dp))
            .border(1.dp, CampusM3Border, RoundedCornerShape(16.dp))
            .padding(14.dp)
    ) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = busNo,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = CampusM3DarkText
                )
                Box(
                    modifier = Modifier
                        .background(color.copy(alpha = 0.15f), RoundedCornerShape(6.dp))
                        .padding(horizontal = 8.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = status,
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold,
                        color = color
                    )
                }
            }
            Spacer(modifier = Modifier.height(6.dp))
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                Icon(imageVector = Icons.Default.Room, contentDescription = "ETA Tracker", tint = CampusM3PrimaryPurple, modifier = Modifier.size(14.dp))
                Text(text = "ETA: ", fontSize = 11.sp, color = CampusM3BodyGray)
                Text(text = eta, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = CampusM3PrimaryPurple)
            }
            Text(
                text = "Next: $nextStop",
                fontSize = 10.sp,
                color = CampusM3BodyGray,
                modifier = Modifier.padding(top = 2.dp)
            )
        }
    }
}

data class MessMenuItem(val timeSlot: String, val menu: String, val cost: String)
