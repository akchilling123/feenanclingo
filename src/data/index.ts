import accounting from './accounting.json'
import valuation from './valuation.json'
import dcf from './dcf.json'
import mergersAcquisitions from './mergers-acquisitions.json'
import lbo from './lbo.json'
import evEquityValue from './ev-equity-value.json'
import type { Question, Topic } from '../types'

const allQuestions = [
  ...accounting,
  ...valuation,
  ...dcf,
  ...mergersAcquisitions,
  ...lbo,
  ...evEquityValue,
] as Question[]

export function getQuestionsByTopic(topic: Topic): Question[] {
  return allQuestions.filter(q => q.topic === topic)
}

export { allQuestions, accounting, valuation, dcf, mergersAcquisitions, lbo, evEquityValue }
