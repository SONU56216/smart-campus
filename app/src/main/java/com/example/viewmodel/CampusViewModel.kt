package com.example.viewmodel

import androidx.lifecycle.ViewModel
import com.example.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.text.SimpleDateFormat
import java.util.*

class CampusViewModel : ViewModel() {

    // 1. Live Seed States matching Postgres migrations
    private val _students = MutableStateFlow<List<Student>>(emptyList())
    val students: StateFlow<List<Student>> = _students.asStateFlow()

    private val _activeStudent = MutableStateFlow<Student?>(null)
    val activeStudent: StateFlow<Student?> = _activeStudent.asStateFlow()

    private val _applications = MutableStateFlow<List<AdmissionApplication>>(emptyList())
    val applications: StateFlow<List<AdmissionApplication>> = _applications.asStateFlow()

    private val _examForms = MutableStateFlow<List<ExamForm>>(emptyList())
    val examForms: StateFlow<List<ExamForm>> = _examForms.asStateFlow()

    private val _admitCards = MutableStateFlow<List<AdmitCard>>(emptyList())
    val admitCards: StateFlow<List<AdmitCard>> = _admitCards.asStateFlow()

    private val _payments = MutableStateFlow<List<Payment>>(emptyList())
    val payments: StateFlow<List<Payment>> = _payments.asStateFlow()

    private val _attendanceRecords = MutableStateFlow<List<Attendance>>(emptyList())
    val attendanceRecords: StateFlow<List<Attendance>> = _attendanceRecords.asStateFlow()

    private val _libraryBooks = MutableStateFlow<List<LibraryBook>>(emptyList())
    val libraryBooks: StateFlow<List<LibraryBook>> = _libraryBooks.asStateFlow()

    // Rotative QR Code token values
    private val _secureQrToken = MutableStateFlow("CAMPUS-INIT-TOKEN-9988X")
    val secureQrToken: StateFlow<String> = _secureQrToken.asStateFlow()

    private val _qrTimeRemaining = MutableStateFlow(30)
    val qrTimeRemaining: StateFlow<Int> = _qrTimeRemaining.asStateFlow()

    init {
        seedInitialStaticData()
        startQrRotationTimer()
    }

    private fun seedInitialStaticData() {
        // Create 5 students matching seed.ts values
        val baseStudents = listOf(
            Student(
                id = "stu-1",
                studentId = "STU2025001",
                fullName = "Aarav Sharma",
                email = "aarav.sharma@college.com",
                phone = "9876543210",
                dob = "2003-05-14",
                gender = "Male",
                category = "General",
                bloodGroup = "O+",
                guardianName = "Sanjay Sharma",
                guardianPhone = "9876543211",
                guardianEmail = "sanjay.sharma@example.com",
                address = "H-456, Rajouri Garden",
                city = "New Delhi",
                state = "Delhi",
                pincode = "110027",
                course = "B.Tech",
                department = "Computer Science and Eng",
                semester = 4,
                year = 2,
                rollNumber = "23CSE101",
                batch = "2023-2027",
                cardStatus = CardStatus.ISSUED,
                cardIssuedAt = "11/2023",
                cardExpiresAt = "06/2027",
                qrCodeData = "CAMPUS-ID-23CSE101-SECURE-KEY-XYZ888",
                cardVersion = 1,
                walletBalance = 2500.0,
                attendancePercentage = 88.5,
                pendingFees = 0.0
            ),
            Student(
                id = "stu-2",
                studentId = "STU2025002",
                fullName = "Diya Patel",
                email = "diya.patel@college.com",
                phone = "8765432109",
                dob = "2004-08-22",
                gender = "Female",
                category = "OBC",
                bloodGroup = "A+",
                guardianName = "Vijay Patel",
                guardianPhone = "8765432111",
                guardianEmail = "vijay.patel@example.com",
                address = "Flat 102, Shanti Kunj",
                city = "Ahmedabad",
                state = "Gujarat",
                pincode = "380009",
                course = "B.Tech",
                department = "Electronics & Comm Eng",
                semester = 2,
                year = 1,
                rollNumber = "24ECE055",
                batch = "2024-2028",
                cardStatus = CardStatus.PENDING,
                cardIssuedAt = null,
                cardExpiresAt = null,
                qrCodeData = null,
                cardVersion = 1,
                walletBalance = 120.0,
                attendancePercentage = 72.0,
                pendingFees = 50000.0 // Tuition Fees
            ),
            Student(
                id = "stu-3",
                studentId = "STU2025003",
                fullName = "Kabir Singh",
                email = "kabir.singh@college.com",
                phone = "7654321098",
                dob = "2002-12-01",
                gender = "Male",
                category = "General",
                bloodGroup = "B+",
                guardianName = "Harbhajan Singh",
                guardianPhone = "7654321011",
                guardianEmail = "harbhajan.singh@example.com",
                address = "Plot 44, Phase 3",
                city = "Mohali",
                state = "Punjab",
                pincode = "160055",
                course = "MCA",
                department = "Computer Applications",
                semester = 2,
                year = 1,
                rollNumber = "24MCA202",
                batch = "2024-2026",
                cardStatus = CardStatus.APPROVED,
                cardIssuedAt = null,
                cardExpiresAt = null,
                qrCodeData = null,
                cardVersion = 1,
                walletBalance = 50.0,
                attendancePercentage = 91.3,
                pendingFees = 0.0
            ),
            Student(
                id = "stu-4",
                studentId = "STU2025004",
                fullName = "Ananya Iyer",
                email = "ananya.iyer@college.com",
                phone = "6543210987",
                dob = "2003-10-10",
                gender = "Female",
                category = "General",
                bloodGroup = "AB+",
                guardianName = "Ramakrishnan Iyer",
                guardianPhone = "6543210911",
                guardianEmail = "ram.iyer@example.com",
                address = "Sector 5, RK Puram",
                city = "New Delhi",
                state = "Delhi",
                pincode = "110022",
                course = "B.Tech",
                department = "Mechanical Engineering",
                semester = 6,
                year = 3,
                rollNumber = "22ME303",
                batch = "2022-2026",
                cardStatus = CardStatus.NOT_APPLIED,
                cardIssuedAt = null,
                cardExpiresAt = null,
                qrCodeData = null,
                cardVersion = 1,
                walletBalance = 0.0,
                attendancePercentage = 65.4,
                pendingFees = 15000.0 // Bus/Hostel dues
            ),
            Student(
                id = "stu-5",
                studentId = "STU2025005",
                fullName = "Aditya Rao",
                email = "aditya.rao@college.com",
                phone = "9988776655",
                dob = "2001-07-19",
                gender = "Male",
                category = "SC",
                bloodGroup = "O-",
                guardianName = "Krishna Rao",
                guardianPhone = "9988776611",
                guardianEmail = "k.rao@example.com",
                address = "No. 12, Jayanagar 4th Block",
                city = "Bengaluru",
                state = "Karnataka",
                pincode = "560011",
                course = "MBA",
                department = "Management Studies",
                semester = 4,
                year = 2,
                rollNumber = "23MBA009",
                batch = "2023-2025",
                cardStatus = CardStatus.ISSUED,
                cardIssuedAt = "10/2023",
                cardExpiresAt = "06/2025",
                qrCodeData = "CAMPUS-ID-23MBA009-SECURE-KEY-ABC321",
                cardVersion = 2,
                walletBalance = 752.5,
                attendancePercentage = 83.2,
                pendingFees = 0.0
            )
        )

        _students.value = baseStudents
        _activeStudent.value = baseStudents.first() // Default is Aarav Sharma

        // Seed initial admission applications
        _applications.value = listOf(
            AdmissionApplication(
                id = "app-1",
                applicationNumber = "APP20256782",
                studentId = "stu-1",
                fullName = "Rohan Deshmukh",
                email = "applicant.rohan@gmail.com",
                phone = "9123456789",
                course = "B.Tech",
                department = "Computer Science and Eng",
                dob = "2007-06-25",
                gender = "Male",
                category = "General",
                bloodGroup = "B+",
                guardianName = "Anand Deshmukh",
                guardianPhone = "9123456780",
                address = "Row House 4, Viman Nagar",
                city = "Pune",
                state = "Maharashtra",
                pincode = "411014",
                highSchoolMarks = 94.5,
                intermediateMarks = 91.2,
                status = ApplicationStatus.APPROVED,
                paymentStatus = PaymentStatus.SUCCESS,
                feePaid = 500.0
            ),
            AdmissionApplication(
                id = "app-2",
                applicationNumber = "APP20259910",
                studentId = null,
                fullName = "Meera Nair",
                email = "applicant.meera@gmail.com",
                phone = "9211002299",
                course = "B.Tech",
                department = "Electrical Engineering",
                dob = "2007-03-12",
                gender = "Female",
                category = "General",
                bloodGroup = "A-",
                guardianName = "Gopakumar Nair",
                guardianPhone = "9211002288",
                address = "Flat 4B, Lotus Apartments, Sector 15",
                city = "Kochi",
                state = "Kerala",
                pincode = "682015",
                highSchoolMarks = 88.0,
                intermediateMarks = 85.5,
                status = ApplicationStatus.UNDER_REVIEW,
                paymentStatus = PaymentStatus.PENDING,
                feePaid = 500.0
            )
        )

        // Seed initial exam forms
        _examForms.value = listOf(
            ExamForm(
                id = "exam-1",
                studentId = "stu-1",
                semester = 4,
                academicYear = "2025-2026",
                subjects = listOf(
                    "CS401: Operating Systems",
                    "CS402: Database Management Systems",
                    "CS403: Computer Networks",
                    "MA401: Discrete Mathematics"
                ),
                isBacklog = false,
                status = ExamFormStatus.APPROVED,
                paymentStatus = PaymentStatus.SUCCESS,
                examFee = 500.0,
                totalPaid = 500.0
            )
        )

        // Seed initial admit cards
        _admitCards.value = listOf(
            AdmitCard(
                id = "admit-1",
                studentId = "stu-1",
                examFormId = "exam-1",
                rollNumber = "23CSE101",
                examCenter = "Block A, IITM Delhi Campus",
                academicYear = "2025-2026",
                semester = 4,
                qrCodeData = "ADMIT-CARD-23CSE101-OS-DBMS-NETWORKS",
                isReleased = true
            )
        )

        // Seed initial payments
        _payments.value = listOf(
            Payment(
                id = "p-1",
                transactionId = "TXN-9988221199",
                gatewayTransactionId = "pay_stripe_99a888b1",
                studentId = "stu-1",
                amount = 500.0,
                purpose = "EXAM_FEE",
                status = PaymentStatus.SUCCESS,
                paymentGateway = "STRIPE",
                createdAt = Date()
            ),
            Payment(
                id = "p-2",
                transactionId = "TXN-4455667788",
                gatewayTransactionId = "pay_razorpay_order_77x8x9",
                studentId = null,
                admissionApplicationId = "app-1",
                amount = 500.0,
                purpose = "APPLICATION_FEE",
                status = PaymentStatus.SUCCESS,
                paymentGateway = "RAZORPAY",
                createdAt = Date()
            )
        )

        // Seed initial attendance records
        _attendanceRecords.value = listOf(
            Attendance(
                id = "att-1",
                studentId = "stu-1",
                dateString = "2026-06-10",
                status = "PRESENT",
                checkedInAt = "08:55 AM",
                checkedOutAt = "04:15 PM",
                method = AttendanceMethod.QR_SCAN,
                location = "Main Block Entrance"
            ),
            Attendance(
                id = "att-2",
                studentId = "stu-5",
                dateString = "2026-06-10",
                status = "PRESENT",
                checkedInAt = "09:12 AM",
                checkedOutAt = "05:02 PM",
                method = AttendanceMethod.MANUAL,
                location = "Seminar Hall"
            )
        )

        // Seed initial digital library books (High density checkout list)
        _libraryBooks.value = listOf(
            LibraryBook("b-1", "Introduction to Algorithms", "Thomas H. Cormen", "Computer Science", "CSE-001"),
            LibraryBook("b-2", "Database System Concepts", "Abraham Silberschatz", "Computer Science", "CSE-045"),
            LibraryBook("b-3", "Computer Networking", "James Kurose", "Computer Science", "CSE-112"),
            LibraryBook("b-4", "Principles of Electrodynamics", "David J. Griffiths", "Physics", "PHY-098"),
            LibraryBook("b-5", "The Art of Computer Programming", "Donald Knuth", "Computer Science", "CSE-350"),
            LibraryBook("b-6", "Linear Algebra and its Applications", "Gilbert Strang", "Mathematics", "MTH-223"),
            LibraryBook("b-7", "Principles of Marketing", "Philip Kotler", "Management", "MGT-412"),
            LibraryBook("b-8", "Operating System Concepts", "Peter B. Galvin", "Computer Science", "CSE-002")
        )
    }

    private fun startQrRotationTimer() {
        Timer().scheduleAtFixedRate(object : TimerTask() {
            override fun run() {
                _qrTimeRemaining.update { t ->
                    if (t <= 1) {
                        // Rotate token
                        val randomKey = (100000..999999).random()
                        _secureQrToken.value = "CAMPUS-ROT-KEY-${_activeStudent.value?.rollNumber ?: "GUEST"}-$randomKey"
                        30
                    } else {
                        t - 1
                    }
                }
            }
        }, 1000L, 1000L)
    }

    // --- Action Methods ---

    fun selectStudent(studentId: String) {
        val std = _students.value.firstOrNull { it.id == studentId }
        if (std != null) {
            _activeStudent.value = std
            // Force QR key rotation immediately
            val randomKey = (100000..999999).random()
            _secureQrToken.value = "CAMPUS-ROT-KEY-${std.rollNumber}-$randomKey"
            _qrTimeRemaining.value = 30
        }
    }

    /**
     * Submit an ID Card application
     */
    fun applyForIdCard(studentId: String) {
        _students.update { list ->
            list.map {
                if (it.id == studentId) {
                    it.copy(cardStatus = CardStatus.PENDING)
                } else it
            }
        }
        updateActiveStudentRef()
    }

    /**
     * Approve ID Card application (Admin Simulation override tool)
     */
    fun approveIdCard(studentId: String) {
        _students.update { list ->
            list.map {
                if (it.id == studentId) {
                    it.copy(cardStatus = CardStatus.APPROVED)
                } else it
            }
        }
        updateActiveStudentRef()
    }

    /**
     * Issue ID Card
     */
    fun issueIdCard(studentId: String) {
        _students.update { list ->
            list.map {
                if (it.id == studentId) {
                    val sdf = SimpleDateFormat("MM/yyyy", Locale.getDefault())
                    val cal = Calendar.getInstance()
                    val issued = sdf.format(cal.time)
                    cal.add(Calendar.YEAR, 4)
                    val expires = sdf.format(cal.time)

                    it.copy(
                        cardStatus = CardStatus.ISSUED,
                        cardIssuedAt = issued,
                        cardExpiresAt = expires,
                        qrCodeData = "CAMPUS-ID-${it.rollNumber}-SECURE-KEY-${(1000..9999).random()}"
                    )
                } else it
            }
        }
        updateActiveStudentRef()
    }

    /**
     * Suspend / Void digital token
     */
    fun suspendIdCard(studentId: String) {
        _students.update { list ->
            list.map {
                if (it.id == studentId) {
                    it.copy(cardStatus = CardStatus.SUSPENDED)
                } else it
            }
        }
        updateActiveStudentRef()
    }

    /**
     * Add money to Campus Wallet balance
     */
    fun topUpWallet(studentId: String, amount: Double) {
        _students.update { list ->
            list.map {
                if (it.id == studentId) {
                    it.copy(walletBalance = it.walletBalance + amount)
                } else it
            }
        }
        updateActiveStudentRef()

        // Log transaction
        val txnId = "TXN-${(1000000000..9999999999).random()}"
        val payment = Payment(
            id = UUID.randomUUID().toString(),
            transactionId = txnId,
            gatewayTransactionId = "pay_wallet_add_${(10000..99999).random()}",
            studentId = studentId,
            amount = amount,
            purpose = "WALLET_TOP_UP",
            status = PaymentStatus.SUCCESS,
            paymentGateway = "RAZORPAY",
            createdAt = Date()
        )
        _payments.update { listOf(payment) + it }
    }

    /**
     * Pay college invoices (Tuition, bus, mess)
     */
    fun payInvoice(studentId: String, amount: Double, purpose: String, gateway: String) {
        val student = _students.value.firstOrNull { it.id == studentId } ?: return
        if (gateway == "WALLET" && student.walletBalance < amount) {
            return // Insufficient balance
        }

        _students.update { list ->
            list.map {
                if (it.id == studentId) {
                    val newWallet = if (gateway == "WALLET") it.walletBalance - amount else it.walletBalance
                    it.copy(
                        walletBalance = newWallet,
                        pendingFees = (it.pendingFees - amount).coerceAtLeast(0.0)
                    )
                } else it
            }
        }
        updateActiveStudentRef()

        val txnId = "TXN-${(1000000000..9999999999).random()}"
        val payment = Payment(
            id = UUID.randomUUID().toString(),
            transactionId = txnId,
            gatewayTransactionId = "pay_invoice_${(10000..99999).random()}",
            studentId = studentId,
            amount = amount,
            purpose = purpose,
            status = PaymentStatus.SUCCESS,
            paymentGateway = gateway,
            createdAt = Date()
        )
        _payments.update { listOf(payment) + it }
    }

    /**
     * Submit an Admission Application
     */
    fun submitAdmissionApplication(app: AdmissionApplication) {
        _applications.update { it + app }
    }

    /**
     * Pay Application Fee
     */
    fun payApplicationFee(appId: String, amount: Double, gateway: String) {
        _applications.update { list ->
            list.map {
                if (it.id == appId) {
                    it.copy(
                        paymentStatus = PaymentStatus.SUCCESS,
                        status = ApplicationStatus.UNDER_REVIEW
                    )
                } else it
            }
        }
        // Log Payment
        val txnId = "TXN-${(1000000000..9999999999).random()}"
        val payment = Payment(
            id = UUID.randomUUID().toString(),
            transactionId = txnId,
            gatewayTransactionId = "pay_admission_${(10000..99999).random()}",
            studentId = null,
            admissionApplicationId = appId,
            amount = amount,
            purpose = "APPLICATION_FEE",
            status = PaymentStatus.SUCCESS,
            paymentGateway = gateway,
            createdAt = Date()
        )
        _payments.update { listOf(payment) + it }
    }

    /**
     * Register for Semester Exams
     */
    fun submitExamForm(
        studentId: String,
        semester: Int,
        subjects: List<String>,
        isBacklog: Boolean,
        backlogSubjects: List<String>,
        fee: Double
    ) {
        val formId = "exam-${(1000..9999).random()}"
        val examForm = ExamForm(
            id = formId,
            studentId = studentId,
            semester = semester,
            academicYear = "2025-2026",
            subjects = subjects,
            isBacklog = isBacklog,
            backlogSubjects = backlogSubjects,
            status = ExamFormStatus.SUBMITTED,
            paymentStatus = PaymentStatus.PENDING,
            examFee = fee,
            totalPaid = 0.0,
            createdAt = Date()
        )
        _examForms.update { it + examForm }
    }

    /**
     * Pay Exam Form Fees & Release Admit Card automatically
     */
    fun payExamForm(formId: String, studentId: String, amount: Double, gateway: String) {
        val student = _students.value.firstOrNull { it.id == studentId } ?: return

        // Deduct if Wallet payment
        if (gateway == "WALLET") {
            if (student.walletBalance < amount) return // fail silently or handled in UI
            _students.update { list ->
                list.map { if (it.id == studentId) it.copy(walletBalance = it.walletBalance - amount) else it }
            }
            updateActiveStudentRef()
        }

        _examForms.update { list ->
            list.map {
                if (it.id == formId) {
                    it.copy(
                        paymentStatus = PaymentStatus.SUCCESS,
                        status = ExamFormStatus.PAID,
                        totalPaid = amount
                    )
                } else it
            }
        }

        // Auto release high density admit card!
        val rollNum = student.rollNumber
        val form = _examForms.value.firstOrNull { it.id == formId }
        if (form != null) {
            val card = AdmitCard(
                id = "admit-${(1000..9999).random()}",
                studentId = studentId,
                examFormId = formId,
                rollNumber = rollNum,
                examCenter = "Main Campus Academic Block C",
                academicYear = form.academicYear,
                semester = form.semester,
                qrCodeData = "ADMIT-CARD-$rollNum-SEM-${form.semester}-${(1000..9999).random()}",
                isReleased = true
            )
            _admitCards.update { it + card }
        }

        // Log payment
        val txnId = "TXN-${(1000000000..9999999999).random()}"
        val payment = Payment(
            id = UUID.randomUUID().toString(),
            transactionId = txnId,
            gatewayTransactionId = "pay_exam_${(10000..99999).random()}",
            studentId = studentId,
            examFormId = formId,
            amount = amount,
            purpose = "EXAM_REGISTRATION_FEE",
            status = PaymentStatus.SUCCESS,
            paymentGateway = gateway,
            createdAt = Date()
        )
        _payments.update { listOf(payment) + it }
    }

    /**
     * Perform Daily Attendance Check-In Simulation
     */
    fun checkInAttendance(studentId: String, method: AttendanceMethod, location: String = "Main Main Entrance") {
        val sdfTime = SimpleDateFormat("hh:mm a", Locale.getDefault())
        val checkIn = sdfTime.format(Date())
        val dateString = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())

        val record = Attendance(
            id = "att-${(1000..9999).random()}",
            studentId = studentId,
            dateString = dateString,
            status = "PRESENT",
            checkedInAt = checkIn,
            checkedOutAt = null,
            method = method,
            location = location,
            deviceId = "trusted-device-${(100..999).random()}"
        )

        _attendanceRecords.update { list ->
            // Delete matching entry for today if exists to avoid double check-in issues
            val clearedList = list.filterNot { it.studentId == studentId && it.dateString == dateString }
            listOf(record) + clearedList
        }

        // Calculate a light bump in attendance percentage!
        _students.update { list ->
            list.map {
                if (it.id == studentId) {
                    val newPercent = (it.attendancePercentage + 0.8).coerceAtMost(100.0)
                    it.copy(attendancePercentage = newPercent)
                } else it
            }
        }
        updateActiveStudentRef()
    }

    /**
     * Perform Daily Attendance Check-Out Simulation
     */
    fun checkOutAttendance(studentId: String) {
        val sdfTime = SimpleDateFormat("hh:mm a", Locale.getDefault())
        val checkOut = sdfTime.format(Date())
        val dateString = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())

        _attendanceRecords.update { list ->
            list.map {
                if (it.studentId == studentId && it.dateString == dateString) {
                    it.copy(checkedOutAt = checkOut)
                } else it
            }
        }
    }

    /**
     * Borrow a digital book from the campus library
     */
    fun borrowLibraryBook(studentId: String, bookId: String) {
        val sdf = SimpleDateFormat("dd MMM, yyyy", Locale.getDefault())
        val cal = Calendar.getInstance()
        val borrow = sdf.format(cal.time)
        cal.add(Calendar.DAY_OF_YEAR, 14) // 2 weeks due period
        val due = sdf.format(cal.time)

        _libraryBooks.update { list ->
            list.map {
                if (it.id == bookId) {
                    it.copy(
                        status = "BORROWED",
                        borrowDate = borrow,
                        dueDate = due
                    )
                } else it
            }
        }
    }

    /**
     * Return borrowed library book
     */
    fun returnLibraryBook(bookId: String) {
        _libraryBooks.update { list ->
            list.map {
                if (it.id == bookId) {
                    it.copy(
                        status = "AVAILABLE",
                        borrowDate = null,
                        dueDate = null
                    )
                } else it
            }
        }
    }

    private fun updateActiveStudentRef() {
        val currentId = _activeStudent.value?.id ?: return
        val updated = _students.value.firstOrNull { it.id == currentId }
        if (updated != null) {
            _activeStudent.value = updated
        }
    }
}
