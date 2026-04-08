#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const QUESTIONS_DIR = path.resolve(__dirname, '..', 'questions')
const WEB_OUTPUT_DIR = path.resolve(__dirname, '..', 'web', 'src', 'data')
const IOS_OUTPUT_DIR = path.resolve(__dirname, '..', 'ios', 'Feenancelingo', 'Resources')
const SCHEMA_PATH = path.join(QUESTIONS_DIR, 'schema.json')

const TOPICS = [
  'accounting',
  'valuation',
  'dcf',
  'mergers-acquisitions',
  'lbo',
  'ev-equity-value',
]

const TOPIC_FILE_MAP = {
  'accounting': 'accounting.json',
  'valuation': 'valuation.json',
  'dcf': 'dcf.json',
  'mergers-acquisitions': 'mergers-acquisitions.json',
  'lbo': 'lbo.json',
  'ev-equity-value': 'ev-equity-value.json',
}

function readQuestionsFromDir(dirPath) {
  const questions = []
  if (!fs.existsSync(dirPath)) return questions

  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      questions.push(...readQuestionsFromDir(fullPath))
    } else if (entry.name.endsWith('.json') && entry.name !== 'schema.json') {
      try {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
        if (Array.isArray(content)) {
          questions.push(...content)
        } else {
          questions.push(content)
        }
      } catch (err) {
        console.error(`Error reading ${fullPath}: ${err.message}`)
      }
    }
  }
  return questions
}

function validateQuestion(q, errors) {
  if (!q.id || !q.topic || !q.difficulty || !q.type || !q.question_text || !q.correct_answer || !q.explanation) {
    errors.push(`${q.id || 'unknown'}: missing required fields`)
    return false
  }
  if (!TOPICS.includes(q.topic)) {
    errors.push(`${q.id}: invalid topic "${q.topic}"`)
    return false
  }
  if (!['Easy', 'Medium', 'Hard'].includes(q.difficulty)) {
    errors.push(`${q.id}: invalid difficulty "${q.difficulty}"`)
    return false
  }
  if (!['multiple_choice', 'numeric', 'true_false', 'conceptual'].includes(q.type)) {
    errors.push(`${q.id}: invalid type "${q.type}"`)
    return false
  }
  if (q.type === 'multiple_choice') {
    if (!q.options || !Array.isArray(q.options)) {
      errors.push(`${q.id}: MC question missing options`)
      return false
    }
    const correctCount = q.options.filter(o => o.isCorrect).length
    if (correctCount !== 1) {
      errors.push(`${q.id}: MC question must have exactly 1 correct option (found ${correctCount})`)
      return false
    }
  }
  return true
}

// Main
const allQuestions = []
const errors = []

for (const topic of TOPICS) {
  const topicDir = path.join(QUESTIONS_DIR, topic)
  const questions = readQuestionsFromDir(topicDir)
  allQuestions.push(...questions)
}

// Check for duplicate IDs
const ids = new Set()
for (const q of allQuestions) {
  if (ids.has(q.id)) {
    errors.push(`Duplicate ID: ${q.id}`)
  }
  ids.add(q.id)
}

// Validate
const validQuestions = []
for (const q of allQuestions) {
  if (validateQuestion(q, errors)) {
    validQuestions.push(q)
  }
}

// Group by topic and write
const grouped = {}
for (const topic of TOPICS) {
  grouped[topic] = validQuestions
    .filter(q => q.topic === topic)
    .sort((a, b) => a.id.localeCompare(b.id))
}

// Write to all output directories that exist
const outputDirs = [WEB_OUTPUT_DIR]
if (fs.existsSync(path.resolve(IOS_OUTPUT_DIR, '..'))) {
  outputDirs.push(IOS_OUTPUT_DIR)
}

for (const outputDir of outputDirs) {
  fs.mkdirSync(outputDir, { recursive: true })
  for (const [topic, questions] of Object.entries(grouped)) {
    const outFile = path.join(outputDir, TOPIC_FILE_MAP[topic])
    fs.writeFileSync(outFile, JSON.stringify(questions, null, 2) + '\n')
  }
  console.log(`Wrote to: ${outputDir}`)
}

// Summary
console.log('\n=== Compile Summary ===\n')
console.log(`Total questions: ${validQuestions.length}`)
console.log('')

console.log('Per topic:')
for (const [topic, questions] of Object.entries(grouped)) {
  console.log(`  ${topic}: ${questions.length}`)
}
console.log('')

console.log('Per difficulty:')
const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 }
for (const q of validQuestions) byDifficulty[q.difficulty]++
for (const [diff, count] of Object.entries(byDifficulty)) {
  console.log(`  ${diff}: ${count}`)
}
console.log('')

console.log('Per type:')
const byType = {}
for (const q of validQuestions) byType[q.type] = (byType[q.type] || 0) + 1
for (const [type, count] of Object.entries(byType)) {
  console.log(`  ${type}: ${count}`)
}

if (errors.length > 0) {
  console.log(`\nErrors (${errors.length}):`)
  for (const err of errors) console.log(`  - ${err}`)
  process.exit(1)
} else {
  console.log('\nNo errors found.')
}
