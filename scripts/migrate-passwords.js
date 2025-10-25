/**
 * Migration script to hash existing plain text passwords
 *
 * This script should be run once to convert all existing plain text passwords
 * to bcrypt hashed passwords. Run this before deploying the updated auth system.
 *
 * Usage: node scripts/migrate-passwords.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function migratePasswords() {
  console.log('🔄 Starting password migration...')

  try {
    // Get all users with potentially plain text passwords
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
      },
    })

    console.log(`📊 Found ${users.length} users to process`)

    let migratedCount = 0
    let skippedCount = 0

    for (const user of users) {
      // Check if password is already hashed (bcrypt hashes start with $2a$, $2b$, or $2y$)
      const isAlreadyHashed = /^\$2[aby]\$/.test(user.password)

      if (isAlreadyHashed) {
        console.log(`⏭️  User ${user.email}: Password already hashed, skipping`)
        skippedCount++
        continue
      }

      // Hash the plain text password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(user.password, saltRounds)

      // Update the user's password
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      })

      console.log(`✅ User ${user.email}: Password migrated successfully`)
      migratedCount++
    }

    console.log('\n🎉 Password migration completed!')
    console.log(`📈 Statistics:`)
    console.log(`   - Migrated: ${migratedCount} users`)
    console.log(`   - Skipped: ${skippedCount} users (already hashed)`)
    console.log(`   - Total: ${users.length} users`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration if this script is called directly
if (require.main === module) {
  migratePasswords()
    .then(() => {
      console.log('🏁 Migration script completed successfully')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Migration script failed:', error)
      process.exit(1)
    })
}

module.exports = { migratePasswords }
