import { PrismaClient, CardStatus, PaymentStatus, ApplicationStatus, ExamFormStatus, AdminRole, AttendanceMethod } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed database run...');

  // 1. Hash passwords
  const salt = await bcrypt.genSalt(12);
  const studentPasswordHash = await bcrypt.hash('Student@123', salt);
  const adminPasswordHash = await bcrypt.hash('Admin@123', salt);

  // 2. Initialize / Upsert College Settings
  const collegeSettings = await prisma.collegeSettings.upsert({
    where: { id: 'default-college' },
    update: {},
    create: {
      id: 'default-college',
      collegeName: 'Indian Institute of Technology and Management (IITM) Delhi',
      shortName: 'IITM Delhi',
      address: 'Main Campus Road, Hauz Khas, New Delhi, Delhi 110016',
      email: 'info@iitm-delhi.edu.in',
      phone: '+91-11-2659-1000',
      website: 'https://www.iitm-delhi.edu.in',
      logoUrl: 'https://res.cloudinary.com/smart-campus/image/upload/v1/logo.png',
      establishedYear: 1998,
      currentAcademicYear: '2025-2026',
      applicationFee: 500.0,
      admissionFee: 10000.0,
      semesterFee: 50000.0,
      examFee: 500.0,
      backlogSubjectFee: 800.0,
      lateFee: 200.0,
      hostelFee: 40000.0,
      messFee: 20000.0,
      busFee: 15000.0,
      cardValidityYears: 4,
      allowDigitalIDCheckout: true,
    },
  });
  console.log('✅ College settings seed upserted.');

  // 3. Upsert Super Admin
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@college.com' },
    update: {},
    create: {
      fullName: 'Dr. Ramesh Kumar (Super Admin)',
      email: 'admin@college.com',
      password: adminPasswordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
      permissions: ['ALL_ACCESS'],
    },
  });
  console.log(`✅ Super Admin seeded: ${admin.email}`);

  // 4. Create/Upsert 5 Students
  const studentsData = [
    {
      studentId: 'STU2025001',
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@college.com',
      phone: '9876543210',
      dob: new Date('2003-05-14'),
      gender: 'Male',
      category: 'General',
      bloodGroup: 'O+',
      guardianName: 'Sanjay Sharma',
      guardianPhone: '9876543211',
      guardianEmail: 'sanjay.sharma@example.com',
      address: 'H-456, Rajouri Garden',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110027',
      course: 'B.Tech',
      department: 'Computer Science and Engineering',
      semester: 4,
      year: 2,
      rollNumber: '23CSE101',
      batch: '2023-2027',
      cardStatus: CardStatus.ISSUED,
      cardIssuedAt: new Date(),
      cardExpiresAt: new Date('2027-06-30'),
      qrCodeData: 'CAMPUS-ID-23CSE101-SECURE-KEY-XYZ888',
      walletBalance: 2500.0,
    },
    {
      studentId: 'STU2025002',
      fullName: 'Diya Patel',
      email: 'diya.patel@college.com',
      phone: '8765432109',
      dob: new Date('2004-08-22'),
      gender: 'Female',
      category: 'OBC',
      bloodGroup: 'A+',
      guardianName: 'Vijay Patel',
      guardianPhone: '8765432111',
      guardianEmail: 'vijay.patel@example.com',
      address: 'Flat 102, Shanti Kunj',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380009',
      course: 'B.Tech',
      department: 'Electronics and Communication Engineering',
      semester: 2,
      year: 1,
      rollNumber: '24ECE055',
      batch: '2024-2028',
      cardStatus: CardStatus.PENDING,
      walletBalance: 120.0,
    },
    {
      studentId: 'STU2025003',
      fullName: 'Kabir Singh',
      email: 'kabir.singh@college.com',
      phone: '7654321098',
      dob: new Date('2002-12-01'),
      gender: 'Male',
      category: 'General',
      bloodGroup: 'B+',
      guardianName: 'Harbhajan Singh',
      guardianPhone: '7654321011',
      guardianEmail: 'harbhajan.singh@example.com',
      address: 'Plot 44, Phase 3',
      city: 'Mohali',
      state: 'Punjab',
      pincode: '160055',
      course: 'MCA',
      department: 'Computer Applications',
      semester: 2,
      year: 1,
      rollNumber: '24MCA202',
      batch: '2024-2026',
      cardStatus: CardStatus.APPROVED,
      walletBalance: 50.0,
    },
    {
      studentId: 'STU2025004',
      fullName: 'Ananya Iyer',
      email: 'ananya.iyer@college.com',
      phone: '6543210987',
      dob: new Date('2003-10-10'),
      gender: 'Female',
      category: 'General',
      bloodGroup: 'AB+',
      guardianName: 'Ramakrishnan Iyer',
      guardianPhone: '6543210911',
      guardianEmail: 'ram.iyer@example.com',
      address: 'Sector 5, RK Puram',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110022',
      course: 'B.Tech',
      department: 'Mechanical Engineering',
      semester: 6,
      year: 3,
      rollNumber: '22ME303',
      batch: '2022-2026',
      cardStatus: CardStatus.NOT_APPLIED,
      walletBalance: 0.0,
    },
    {
      studentId: 'STU2025005',
      fullName: 'Aditya Rao',
      email: 'aditya.rao@college.com',
      phone: '9988776655',
      dob: new Date('2001-07-19'),
      gender: 'Male',
      category: 'SC',
      bloodGroup: 'O-',
      guardianName: 'Krishna Rao',
      guardianPhone: '9988776611',
      guardianEmail: 'k.rao@example.com',
      address: 'No. 12, Jayanagar 4th Block',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560011',
      course: 'MBA',
      department: 'Management Studies',
      semester: 4,
      year: 2,
      rollNumber: '23MBA009',
      batch: '2023-2025',
      cardStatus: CardStatus.ISSUED,
      cardIssuedAt: new Date('2023-10-01'),
      cardExpiresAt: new Date('2025-06-30'),
      qrCodeData: 'CAMPUS-ID-23MBA009-SECURE-KEY-ABC321',
      walletBalance: 752.5,
    },
  ];

  const students: any[] = [];
  for (const s of studentsData) {
    const student = await prisma.student.upsert({
      where: { email: s.email },
      update: {},
      create: {
        ...s,
        password: studentPasswordHash,
      },
    });
    students.push(student);
    console.log(`✅ Student seeded: ${student.fullName} (${student.studentId})`);
  }

  // 5. Seed Admission Applications
  const app1 = await prisma.admissionApplication.upsert({
    where: { email: 'applicant.rohan@gmail.com' },
    update: {},
    create: {
      applicationNumber: 'APP20256782',
      fullName: 'Rohan Deshmukh',
      email: 'applicant.rohan@gmail.com',
      phone: '9123456789',
      course: 'B.Tech',
      department: 'Computer Science and Engineering',
      dob: new Date('2007-06-25'),
      gender: 'Male',
      category: 'General',
      bloodGroup: 'B+',
      guardianName: 'Anand Deshmukh',
      guardianPhone: '9123456780',
      address: 'Row House 4, Viman Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411014',
      highSchoolMarks: 94.5,
      intermediateMarks: 91.2,
      status: ApplicationStatus.APPROVED,
      paymentStatus: PaymentStatus.SUCCESS,
      feePaid: 500.0,
    },
  });

  const app2 = await prisma.admissionApplication.upsert({
    where: { email: 'applicant.meera@gmail.com' },
    update: {},
    create: {
      applicationNumber: 'APP20259910',
      fullName: 'Meera Nair',
      email: 'applicant.meera@gmail.com',
      phone: '9211002299',
      course: 'B.Tech',
      department: 'Electrical Engineering',
      dob: new Date('2007-03-12'),
      gender: 'Female',
      category: 'General',
      bloodGroup: 'A-',
      guardianName: 'Gopakumar Nair',
      guardianPhone: '9211002288',
      address: 'Flat 4B, Lotus Apartments, Sector 15',
      city: 'Kochi',
      state: 'Kerala',
      pincode: '682015',
      highSchoolMarks: 88.0,
      intermediateMarks: 85.5,
      status: ApplicationStatus.UNDER_REVIEW,
      paymentStatus: PaymentStatus.PENDING,
      feePaid: 500.0,
    },
  });
  console.log(`✅ Admission Applications seeded: ${app1.applicationNumber}, ${app2.applicationNumber}`);

  // 6. Seed Exam Form for student 1 (Aarav Sharma)
  const student1Id = students[0].id;
  const examForm = await prisma.examForm.create({
    data: {
      studentId: student1Id,
      semester: 4,
      academicYear: '2025-2026',
      subjects: ['CS401: Operating Systems', 'CS402: Database Management Systems', 'CS403: Computer Networks', 'MA401: Discrete Mathematics'],
      isBacklog: false,
      status: ExamFormStatus.APPROVED,
      paymentStatus: PaymentStatus.SUCCESS,
      examFee: 500.0,
      totalPaid: 500.0,
    },
  });
  console.log(`✅ Exam form seeded for Student Partner: ${examForm.id}`);

  // 7. Seed Admit Card for that Exam Form
  const admitCard = await prisma.admitCard.create({
    data: {
      studentId: student1Id,
      examFormId: examForm.id,
      rollNumber: students[0].rollNumber,
      examCenter: 'Block A, IITM Delhi Campus',
      academicYear: '2025-2026',
      semester: 4,
      qrCodeData: `ADMIT-CARD-${students[0].rollNumber}-OS-DBMS-NETWORKS`,
      isReleased: true,
    },
  });
  console.log(`✅ Admit card seeded: ${admitCard.id}`);

  // 8. Seed Sample Attendance for student 1 and student 5
  const attendanceRecords = [
    {
      studentId: students[0].id,
      date: new Date('2026-06-10T00:00:00Z'),
      status: 'PRESENT',
      checkedInAt: new Date('2026-06-10T08:55:00Z'),
      checkedOutAt: new Date('2026-06-10T16:05:00Z'),
      method: AttendanceMethod.QR_SCAN,
    },
    {
      studentId: students[0].id,
      date: new Date('2026-06-11T00:00:00Z'),
      status: 'PRESENT',
      checkedInAt: new Date('2026-06-11T09:02:00Z'),
      checkedOutAt: null,
      method: AttendanceMethod.QR_SCAN,
    },
    {
      studentId: students[4].id,
      date: new Date('2026-06-11T00:00:00Z'),
      status: 'PRESENT',
      checkedInAt: new Date('2026-06-11T09:15:00Z'),
      checkedOutAt: null,
      method: AttendanceMethod.MANUAL,
    },
  ];

  for (const record of attendanceRecords) {
    await prisma.attendance.create({
      data: record,
    });
  }
  console.log('✅ Sample attendance records seeded.');

  // 9. Seed payments
  await prisma.payment.create({
    data: {
      transactionId: 'TXN-9988221199',
      gatewayTransactionId: 'pay_stripe_99a888b1',
      studentId: students[0].id,
      amount: 500.0,
      purpose: 'EXAM_FEE',
      status: PaymentStatus.SUCCESS,
      paymentGateway: 'STRIPE',
    },
  });

  await prisma.payment.create({
    data: {
      transactionId: 'TXN-4455667788',
      gatewayTransactionId: 'pay_razorpay_order_77x8x9',
      admissionApplicationId: app1.id,
      amount: 500.0,
      purpose: 'APPLICATION_FEE',
      status: PaymentStatus.SUCCESS,
      paymentGateway: 'RAZORPAY',
    },
  });
  console.log('✅ Payments seeded.');

  console.log('🌳 Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error executing seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
