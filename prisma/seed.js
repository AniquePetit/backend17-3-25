import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import amenityData from '../src/data/amenities.json' assert { type: 'json' };
import bookingData from '../src/data/bookings.json' assert { type: 'json' };
import hostData from '../src/data/hosts.json' assert { type: 'json' };
import propertyData from '../src/data/properties.json' assert { type: 'json' };
import reviewData from '../src/data/reviews.json' assert { type: 'json' };
import userData from '../src/data/users.json' assert { type: 'json' };
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

const saltRounds = 10; // Sterkte van bcrypt hashing

async function main() {
    console.log("🚀 Start seeding...");

    // ❌ Verwijder bestaande data om duplicaten te voorkomen
    await prisma.booking.deleteMany();
    await prisma.review.deleteMany();
    await prisma.property.deleteMany();
    await prisma.host.deleteMany();
    await prisma.user.deleteMany();
    await prisma.amenity.deleteMany();

    const { amenities } = amenityData;
    const { bookings } = bookingData;
    const { hosts } = hostData;
    const { properties } = propertyData;
    const { reviews } = reviewData;
    const { users } = userData;

    // ✅ Upsert Amenities
    console.log("⏳ Seeding amenities...");
    const amenityMap = {}; // Om ID's makkelijk terug te vinden
    for (const amenity of amenities) {
        const amenityId = amenity.id || uuidv4();
        const createdAmenity = await prisma.amenity.upsert({
            where: { id: amenityId },
            update: {},
            create: { id: amenityId, name: amenity.name },
        });
        amenityMap[amenity.name] = createdAmenity.id;
    }

    // ✅ Upsert Hosts
    console.log("⏳ Seeding hosts...");
    for (const host of hosts) {
        await prisma.host.upsert({
            where: { id: host.id },
            update: {},
            create: host,
        });
    }

    // ✅ Upsert Users
    console.log("⏳ Seeding users...");
    for (const user of users) {
        const userId = user.id || uuidv4();
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        await prisma.user.upsert({
            where: { username: user.username },
            update: {},
            create: {
                id: userId,
                name: user.name,
                email: user.email,
                password: hashedPassword,
                username: user.username,
                phoneNumber: user.phoneNumber,
                profilePicture: user.profilePicture,
                pictureUrl: user.pictureUrl || "https://example.com/default-profile-pic.jpg",
            },
        });
    }

    // ✅ Upsert Properties (met amenities)
    console.log("⏳ Seeding properties...");
    for (const property of properties) {
        const propertyId = property.id || uuidv4();
        
        // Check of de host bestaat
        const hostExists = await prisma.host.findUnique({
            where: { id: property.hostId },
        });

        if (!hostExists) {
            console.warn(`⚠️ Host met ID ${property.hostId} niet gevonden. Property wordt overgeslagen.`);
            continue;
        }

        await prisma.property.upsert({
            where: { id: propertyId },
            update: {},
            create: {
                id: propertyId,
                title: property.title,
                description: property.description,
                location: property.location,
                pricePerNight: property.pricePerNight,
                bedroomCount: property.bedroomCount,
                bathRoomCount: property.bathRoomCount,
                maxGuestCount: property.maxGuestCount,
                rating: property.rating,
                hostId: property.hostId,
                
            },
        });
    }

    // ✅ Upsert Bookings
    console.log("⏳ Seeding bookings...");
    for (const booking of bookings) {
        if (!users.some(user => user.id === booking.userId)) {
            console.warn(`⚠️ User met ID ${booking.userId} niet gevonden. Booking wordt overgeslagen.`);
            continue;
        }

        if (!properties.some(property => property.id === booking.propertyId)) {
            console.warn(`⚠️ Property met ID ${booking.propertyId} niet gevonden. Booking wordt overgeslagen.`);
            continue;
        }

        const bookingId = booking.id || uuidv4();

        await prisma.booking.upsert({
            where: { id: bookingId },
            update: {},
            create: {
                id: bookingId,
                userId: booking.userId,
                propertyId: booking.propertyId,
                checkinDate: new Date(booking.checkinDate),
                checkoutDate: new Date(booking.checkoutDate),
                numberOfGuests: booking.numberOfGuests,
                totalPrice: booking.totalPrice,
                bookingStatus: booking.bookingStatus,
            },
        });
    }

    // ✅ Upsert Reviews
    console.log("⏳ Seeding reviews...");
    for (const review of reviews) {
        const reviewId = review.id || uuidv4();
        await prisma.review.upsert({
            where: { id: reviewId },
            update: {},
            create: {
                id: reviewId,
                userId: review.userId,
                propertyId: review.propertyId,
                rating: review.rating,
                comment: review.comment,
            },
        });
    }

    console.log("✅ Seeding voltooid!");
}

// **Run de seed functie**
main()
    .then(() => {
        console.log('🎉 Alle data is succesvol geïmporteerd!');
        prisma.$disconnect();
    })
    .catch((error) => {
        console.error('❌ Fout tijdens seeding:', error);
        prisma.$disconnect();
        process.exit(1);
    });
