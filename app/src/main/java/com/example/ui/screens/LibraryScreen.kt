package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.example.model.LibraryBook
import com.example.ui.theme.*
import com.example.viewmodel.CampusViewModel

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun LibraryScreen(
    viewModel: CampusViewModel,
    modifier: Modifier = Modifier
) {
    val activeStudent by viewModel.activeStudent.collectAsState()
    val libraryBooks by viewModel.libraryBooks.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var activeCategoryFilter by remember { mutableStateOf("ALL") } // ALL, Computer Science, Physics, Mathematics, Management

    val catFilters = listOf("ALL", "Computer Science", "Physics", "Mathematics", "Management")

    val student = activeStudent ?: return

    // Filters books based on search term & category tabs
    val filteredBooks = libraryBooks.filter {
        val matchesSearch = it.title.contains(searchQuery, ignoreCase = true) || it.author.contains(searchQuery, ignoreCase = true)
        val matchesCategory = activeCategoryFilter == "ALL" || it.category.equals(activeCategoryFilter, ignoreCase = true)
        matchesSearch && matchesCategory
    }

    // Books borrowed by active student
    val activeBorrows = libraryBooks.filter { it.status == "BORROWED" }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(CampusBackground)
            .padding(horizontal = 14.dp)
            .testTag("library_screen"),
        verticalArrangement = Arrangement.spacedBy(10.dp),
        contentPadding = PaddingValues(top = 10.dp, bottom = 24.dp)
    ) {
        // 1. Digital Library Information Block
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(CampusM3PurpleContainer, RoundedCornerShape(20.dp))
                    .padding(14.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .background(Color.White, RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Book, contentDescription = "Library", tint = CampusM3PrimaryPurple)
                    }
                    Column {
                        Text(
                            text = "METROPOLITAN DIGITAL LIBRARY",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DeepPurple,
                            letterSpacing = 0.5.sp
                        )
                        Text(
                            text = "Card No: LIB-${student.rollNumber}",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = CampusM3DeepPurple
                        )
                        Text(
                            text = "Max Allowance: 3 Books • Max Period: 14 Days",
                            fontSize = 9.sp,
                            color = CampusM3DeepPurple.copy(alpha = 0.7f)
                        )
                    }
                }
            }
        }

        // 2. Active Borrows list
        item {
            var expandedBorrows by remember { mutableStateOf(true) }
            Column {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { expandedBorrows = !expandedBorrows }
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "ACTIVE BORROW CHANNELS (${activeBorrows.size})",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontWeight = FontWeight.Bold,
                            color = CampusM3PrimaryPurple,
                            letterSpacing = 1.sp
                        )
                    )
                    Icon(
                        imageVector = if (expandedBorrows) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                        contentDescription = "Collapse section",
                        tint = CampusM3PrimaryPurple
                    )
                }

                AnimatedVisibility(visible = expandedBorrows) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        if (activeBorrows.isEmpty()) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .background(Color.White, RoundedCornerShape(12.dp))
                                    .border(1.dp, CampusM3Border, RoundedCornerShape(12.dp))
                                    .padding(12.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = "You do not have any active books checked out currently.",
                                    fontSize = 11.sp,
                                    color = CampusM3BodyGray,
                                    textAlign = TextAlign.Center
                                )
                            }
                        } else {
                            activeBorrows.forEach { book ->
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(Color.White, RoundedCornerShape(14.dp))
                                        .border(2.dp, CampusM3PrimaryPurple, RoundedCornerShape(14.dp))
                                        .padding(12.dp)
                                ) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(text = book.title, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                                            Text(text = book.author, fontSize = 10.sp, color = CampusM3BodyGray)
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(
                                                text = "Due on: ${book.dueDate ?: "14 Days"}",
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = CampusM3ErrorRed
                                            )
                                        }
                                        Button(
                                            onClick = { viewModel.returnLibraryBook(book.id) },
                                            colors = ButtonDefaults.buttonColors(containerColor = CampusM3LightBlue, contentColor = CampusM3DarkBlue),
                                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 2.dp),
                                            shape = RoundedCornerShape(10.dp),
                                            modifier = Modifier.height(28.dp)
                                        ) {
                                            Text("Return", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // 3. Search Bar
        item {
            Text(
                text = "SEARCH BOOK CATALOG",
                style = MaterialTheme.typography.labelSmall.copy(
                    fontWeight = FontWeight.Bold,
                    color = CampusM3PrimaryPurple,
                    letterSpacing = 1.sp
                )
            )
            Spacer(modifier = Modifier.height(4.dp))
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = { Text("Search by title, author...", fontSize = 11.sp) },
                leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = "Search icon") },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("book_search_box"),
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CampusM3PrimaryPurple,
                    unfocusedBorderColor = CampusM3Border
                )
            )
        }

        // 4. Category Filters Horizontal Scrolling tabs
        item {
            Row(
                modifier = Modifier
                    .fillModifier()
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                catFilters.forEach { cat ->
                    val isSel = activeCategoryFilter == cat
                    Box(
                        modifier = Modifier
                            .background(
                                color = if (isSel) CampusM3PrimaryPurple else CampusM3GraySurface,
                                shape = RoundedCornerShape(50.dp)
                            )
                            .border(
                                width = 1.dp,
                                color = if (isSel) CampusM3PrimaryPurple else CampusM3Border,
                                shape = RoundedCornerShape(50.dp)
                            )
                            .clickable { activeCategoryFilter = cat }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = cat,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isSel) Color.White else CampusM3BodyGray
                        )
                    }
                }
            }
        }

        // 5. Books listing
        if (filteredBooks.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.SearchOff,
                            contentDescription = "Search off",
                            modifier = Modifier.size(40.dp),
                            tint = CampusM3Border
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "No books match your criteria.",
                            fontSize = 11.sp,
                            color = CampusM3BodyGray,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            }
        } else {
            items(filteredBooks) { book ->
                val isBorrowed = book.status == "BORROWED"

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
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Box(
                                modifier = Modifier
                                    .background(CampusM3GraySurface, RoundedCornerShape(4.dp))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(text = book.category, fontSize = 8.sp, fontWeight = FontWeight.Bold, color = CampusM3PrimaryPurple)
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(text = book.title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = CampusM3DarkText)
                            Text(text = "by ${book.author}", fontSize = 10.sp, color = CampusM3BodyGray)
                            Text(text = "Barcode: ${book.barcode}", fontSize = 9.sp, color = CampusM3BodyGray)
                        }

                        Spacer(modifier = Modifier.width(8.dp))

                        if (isBorrowed) {
                            Box(
                                modifier = Modifier
                                    .background(CampusM3GraySurface, RoundedCornerShape(8.dp))
                                    .padding(horizontal = 10.dp, vertical = 6.dp)
                            ) {
                                Text(text = "CHECKED OUT", fontSize = 9.sp, color = CampusM3BodyGray, fontWeight = FontWeight.Bold)
                            }
                        } else {
                            Button(
                                onClick = { viewModel.borrowLibraryBook(student.id, book.id) },
                                colors = ButtonDefaults.buttonColors(containerColor = CampusM3PrimaryPurple),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 2.dp),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier
                                    .height(30.dp)
                                    .testTag("borrow_btn_${book.id}")
                            ) {
                                Text("Borrow", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}

// Workaround for Compose Row horizontal scroll inside modifier
fun Modifier.fillModifier(): Modifier = this.then(Modifier.fillMaxWidth())
