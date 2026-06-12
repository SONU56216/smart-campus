package com.example.model

import java.util.Date

enum class CardStatus {
    NOT_APPLIED,
    PENDING,
    APPROVED,
    REJECTED,
    ISSUED,
    SUSPENDED,
    EXPIRED
}

enum class PaymentStatus {
    PENDING,
    SUCCESS,
    FAILED,
    REFUNDED
}

enum class ApplicationStatus {
    SUBMITTED,
    UNDER_REVIEW,
    APPROVED,
    REJECTED
}

enum class ExamFormStatus {
    SUBMITTED,
    APPROVED,
    REJECTED,
    PAID
}

enum class AttendanceMethod {
    QR_SCAN,
    BIOMETRIC,
    MANUAL,
    GEOFENCE
}

data class Student(
    val id: String,
    val studentId: String,
    val fullName: String,
    val email: String,
    val phone: String,
    val dob: String,
    val gender: String,
    val category: String,
    val bloodGroup: String,
    val guardianName: String,
    val guardianPhone: String,
    val guardianEmail: String,
    val address: String,
    val city: String,
    val state: String,
    val pincode: String,
    val course: String,
    val department: String,
    val semester: Int,
    val year: Int,
    val rollNumber: String,
    val batch: String,
    val cardStatus: CardStatus,
    val cardIssuedAt: String?,
    val cardExpiresAt: String?,
    val qrCodeData: String?,
    val cardVersion: Int = 1,
    val walletBalance: Double = 0.0,
    val isActive: Boolean = true,
    val attendancePercentage: Double = 80.0,
    val pendingFees: Double = 0.0
)

data class AdmissionApplication(
    val id: String,
    val applicationNumber: String,
    val studentId: String?,
    val fullName: String,
    val email: String,
    val phone: String,
    val course: String,
    val department: String,
    val dob: String,
    val gender: String,
    val category: String,
    val bloodGroup: String,
    val guardianName: String,
    val guardianPhone: String,
    val address: String,
    val city: String,
    val state: String,
    val pincode: String,
    val highSchoolMarks: Double,
    val intermediateMarks: Double,
    val status: ApplicationStatus = ApplicationStatus.SUBMITTED,
    val remarks: String? = null,
    val paymentStatus: PaymentStatus = PaymentStatus.PENDING,
    val feePaid: Double = 500.0,
    val createdAt: Date = Date()
)

data class ExamForm(
    val id: String,
    val studentId: String,
    val semester: Int,
    val academicYear: String,
    val subjects: List<String>,
    val isBacklog: Boolean = false,
    val backlogSubjects: List<String> = emptyList(),
    val status: ExamFormStatus = ExamFormStatus.SUBMITTED,
    val paymentStatus: PaymentStatus = PaymentStatus.PENDING,
    val examFee: Double = 500.0,
    val lateFee: Double = 0.0,
    val totalPaid: Double = 0.0,
    val createdAt: Date = Date()
)

data class AdmitCard(
    val id: String,
    val studentId: String,
    val examFormId: String,
    val rollNumber: String,
    val examCenter: String = "Campus Main Block B",
    val academicYear: String,
    val semester: Int,
    val qrCodeData: String,
    val isReleased: Boolean = false
)

data class Payment(
    val id: String,
    val transactionId: String,
    val gatewayTransactionId: String?,
    val studentId: String?,
    val admissionApplicationId: String? = null,
    val examFormId: String? = null,
    val amount: Double,
    val purpose: String,
    val status: PaymentStatus = PaymentStatus.PENDING,
    val paymentGateway: String,
    val receiptUrl: String? = null,
    val createdAt: Date = Date()
)

data class Attendance(
    val id: String,
    val studentId: String,
    val dateString: String, // e.g. "2026-06-11"
    val status: String, // PRESENT, ABSENT
    val checkedInAt: String?, // e.g. "08:55 AM"
    val checkedOutAt: String?, // e.g. "04:15 PM"
    val method: AttendanceMethod = AttendanceMethod.QR_SCAN,
    val deviceId: String? = null,
    val location: String? = null
)

data class LibraryBook(
    val id: String,
    val title: String,
    val author: String,
    val category: String,
    val barcode: String,
    var borrowDate: String? = null,
    var dueDate: String? = null,
    var status: String = "AVAILABLE" // AVAILABLE, BORROWED
)
