const { OpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const { LLMChain } = require("langchain/chains");
const { JsonOutputParser } = require("@langchain/core/output_parsers");

async function classifyEmails(emails, openaiKey) {
  console.log(`Classifying ${emails.length} emails`);

  const model = new OpenAI({ 
    openAIApiKey: openaiKey, 
    modelName: "gpt-3.5-turbo",
    temperature: 0.5
  });

  const promptTemplate = PromptTemplate.fromTemplate(
    "Classify the following email into one of these categories: Important, Promotional, Social, Marketing, Spam, or General.\n\nSubject: {subject}\n\nContent: {content}\n\nProvide the classification as a JSON object with a 'classification' key."
  );

  const outputParser = new JsonOutputParser();

  const chain = new LLMChain({
    llm: model,
    prompt: promptTemplate,
    outputParser,
  });

  const classifiedEmails = await Promise.all(
    emails.map(async (email) => {
      try {
        const result = await chain.call({
          subject: email.subject,
          content: email.snippet,
        });

        const classification = result.classification;

        // Validate the classification
        const validCategories = ['Important', 'Promotional', 'Social', 'Marketing', 'Spam', 'General'];
        return { 
          ...email, 
          classification: validCategories.includes(classification) ? classification : 'General'
        };
      } catch (error) {
        console.error('Classification error:', error);
        return { ...email, classification: 'General' };
      }
    })
  );

  return classifiedEmails;
}

module.exports = { classifyEmails };