require("dotenv").config();
const mongoose = require("mongoose");
const Appointment = require("./models/Appointment");

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const data = [
    { patientName:"Aida Kentay", doctorName:"Dr. Smith", date:"2026-02-02", time:"10:00", department:"Dental", reason:"Tooth pain", status:"scheduled", phone:"+7 777 111 2233" },
    { patientName:"Tomiris A.", doctorName:"Dr. Brown", date:"2026-02-03", time:"11:30", department:"Cardiology", reason:"Heart checkup", status:"scheduled", phone:"+7 777 222 3344" },
    { patientName:"Daniyar K.", doctorName:"Dr. Lee", date:"2026-02-04", time:"09:15", department:"Neurology", reason:"Headache", status:"scheduled", phone:"+7 777 333 4455" },
    { patientName:"Aruzhan S.", doctorName:"Dr. Wilson", date:"2026-02-05", time:"14:40", department:"Dermatology", reason:"Skin rash", status:"scheduled", phone:"+7 777 444 5566" },
    { patientName:"Madi R.", doctorName:"Dr. Johnson", date:"2026-02-06", time:"16:20", department:"ENT", reason:"Sore throat", status:"scheduled", phone:"+7 777 555 6677" },
    { patientName:"Sabina T.", doctorName:"Dr. Davis", date:"2026-02-07", time:"12:10", department:"Ophthalmology", reason:"Vision test", status:"scheduled", phone:"+7 777 666 7788" },
    { patientName:"Nursultan P.", doctorName:"Dr. Miller", date:"2026-02-08", time:"08:45", department:"Orthopedics", reason:"Knee pain", status:"scheduled", phone:"+7 777 777 8899" },
    { patientName:"Aliya B.", doctorName:"Dr. Taylor", date:"2026-02-09", time:"13:00", department:"Therapy", reason:"General checkup", status:"scheduled", phone:"+7 777 888 9900" },
    { patientName:"Askar N.", doctorName:"Dr. Moore", date:"2026-02-10", time:"15:30", department:"Gastroenterology", reason:"Stomach pain", status:"scheduled", phone:"+7 700 111 2233" },
    { patientName:"Zarina K.", doctorName:"Dr. Clark", date:"2026-02-11", time:"10:50", department:"Dental", reason:"Cleaning", status:"scheduled", phone:"+7 700 222 3344" },

    // 10 more
    { patientName:"Dias S.", doctorName:"Dr. Smith", date:"2026-02-12", time:"09:05", department:"Dental", reason:"Braces consult", status:"scheduled", phone:"+7 700 333 4455" },
    { patientName:"Aidana M.", doctorName:"Dr. Brown", date:"2026-02-13", time:"17:10", department:"Cardiology", reason:"Blood pressure", status:"scheduled", phone:"+7 700 444 5566" },
    { patientName:"Arman Z.", doctorName:"Dr. Lee", date:"2026-02-14", time:"11:00", department:"Neurology", reason:"Migraine follow-up", status:"scheduled", phone:"+7 700 555 6677" },
    { patientName:"Madina E.", doctorName:"Dr. Wilson", date:"2026-02-15", time:"12:35", department:"Dermatology", reason:"Acne treatment", status:"scheduled", phone:"+7 700 666 7788" },
    { patientName:"Sultan A.", doctorName:"Dr. Johnson", date:"2026-02-16", time:"14:10", department:"ENT", reason:"Ear pain", status:"scheduled", phone:"+7 700 777 8899" },
    { patientName:"Aigerim Y.", doctorName:"Dr. Davis", date:"2026-02-17", time:"16:45", department:"Ophthalmology", reason:"Dry eyes", status:"scheduled", phone:"+7 700 888 9900" },
    { patientName:"Ruslan V.", doctorName:"Dr. Miller", date:"2026-02-18", time:"10:15", department:"Orthopedics", reason:"Back pain", status:"scheduled", phone:"+7 701 111 2233" },
    { patientName:"Dana H.", doctorName:"Dr. Taylor", date:"2026-02-19", time:"09:30", department:"Therapy", reason:"Flu symptoms", status:"scheduled", phone:"+7 701 222 3344" },
    { patientName:"Karina L.", doctorName:"Dr. Moore", date:"2026-02-20", time:"13:25", department:"Gastroenterology", reason:"Diet consult", status:"scheduled", phone:"+7 701 333 4455" },
    { patientName:"Timur Q.", doctorName:"Dr. Clark", date:"2026-02-21", time:"15:55", department:"Dental", reason:"Tooth filling", status:"scheduled", phone:"+7 701 444 5566" },
  ];

  await Appointment.deleteMany({});
  await Appointment.insertMany(data);

  console.log("✅ Seeded 20 appointments");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
