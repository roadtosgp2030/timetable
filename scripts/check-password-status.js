/**
 * Utility script to check password hash status for users
 *
 * Usage: node scripts/check-password-status.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function checkPasswordStatus() {
  console.log('🔍 Checking password hash status...')

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        password: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`📊 Found ${users.length} users\n`)

    let hashedCount = 0
    let plainTextCount = 0

    users.forEach(user => {
      const isHashed = /^\$2[aby]\$/.test(user.password)
      const status = isHashed ? '🔒 HASHED' : '⚠️  PLAIN TEXT'
      const passwordLength = user.password.length
      const createdDate = user.createdAt
        ? user.createdAt.toISOString().split('T')[0]
        : 'Unknown'

      console.log(
        `${status} | ${user.email} | Length: ${passwordLength} | Created: ${createdDate}`
      )

      if (isHashed) {
        hashedCount++
      } else {
        plainTextCount++
      }
    })

    console.log('\n📈 Summary:')
    console.log(`   🔒 Hashed passwords: ${hashedCount}`)
    console.log(`   ⚠️  Plain text passwords: ${plainTextCount}`)

    if (plainTextCount > 0) {
      console.log('\n⚠️  WARNING: Some passwords are still in plain text!')
      console.log(
        '   Run the migration script: node scripts/migrate-passwords.js'
      )
    } else {
      console.log('\n✅ All passwords are properly hashed!')
    }
  } catch (error) {
    console.error('❌ Check failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Test password hashing
async function testPasswordHashing() {
  console.log('\n🧪 Testing password hashing...')

  const testPassword = 'TestPassword123'
  const hashedPassword = await bcrypt.hash(testPassword, 12)

  console.log(`Original: ${testPassword}`)
  console.log(`Hashed: ${hashedPassword}`)

  const isValid = await bcrypt.compare(testPassword, hashedPassword)
  console.log(`Verification: ${isValid ? '✅ PASS' : '❌ FAIL'}`)
}

// Run the check if this script is called directly
if (require.main === module) {
  Promise.all([checkPasswordStatus(), testPasswordHashing()])
    .then(() => {
      console.log('\n🏁 Password status check completed')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Check failed:', error)
      process.exit(1)
    })
}

module.exports = { checkPasswordStatus, testPasswordHashing }
