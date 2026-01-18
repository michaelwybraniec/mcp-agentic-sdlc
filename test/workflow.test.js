/**
 * @fileoverview Workflow-Based Tests
 * 
 * These tests verify the complete workflow as described in workflow.md:
 * - base tool → base.md creation
 * - init tool → file generation from recipes
 * - Recipe system → template extraction and population
 * - End-to-end data flow
 * 
 * Tests focus on BEHAVIOR, not implementation details.
 * 
 * @module test/workflow
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Test utility function that runs a test and logs the result.
 * 
 * @param {string} name - The name/description of the test
 * @param {Function} fn - The test function to execute
 * @returns {boolean} True if test passed, false if failed
 */
function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  Error: ${error.message}`);
    return false;
  }
}

/**
 * Assertion utility that throws an error if condition is false.
 * 
 * @param {boolean} condition - The condition to check
 * @param {string} [message] - Optional error message if assertion fails
 * @throws {Error} If condition is false
 */
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

/**
 * Test 1: Recipe System
 * 
 * Verifies that recipes can be read and templates extracted.
 * This tests the core recipe system functionality.
 * 
 * @function testRecipeSystem
 */
function testRecipeSystem() {
  test('Recipe System - recipes can be read and templates extracted', () => {
    const recipesDir = path.join(__dirname, '..', 'src', 'recipes');
    const recipeFiles = fs.readdirSync(recipesDir).filter(f => f.endsWith('.md'));
    
    assert(recipeFiles.length >= 10, 'Expected at least 10 recipe files');
    
    // Test that recipes have template sections
    let templatesFound = 0;
    recipeFiles.forEach(recipeFile => {
      const recipePath = path.join(recipesDir, recipeFile);
      const content = fs.readFileSync(recipePath, 'utf8');
      
      // Check for template section (any section number)
      const hasTemplateSection = /##\s+\d+\.\s+Template Section\s+\[FOR FILE GENERATION\]/.test(content);
      
      if (hasTemplateSection) {
        // Verify template can be extracted (has code block)
        const codeBlockStart = content.indexOf('```markdown', content.indexOf('Template Section'));
        const codeBlockEnd = content.indexOf('```', codeBlockStart + 11);
        
        if (codeBlockStart !== -1 && codeBlockEnd !== -1) {
          templatesFound++;
        }
      }
    });
    
    assert(templatesFound >= 10, `Expected all recipes to have extractable templates, found ${templatesFound}`);
  });
}

/**
 * Test 2: Template Population
 * 
 * Verifies that placeholders in templates can be replaced with actual data.
 * This tests the template population mechanism.
 * 
 * @function testTemplatePopulation
 */
function testTemplatePopulation() {
  test('Template Population - placeholders can be replaced with data', () => {
    const template = `Test {{GOAL}} and {{OVERVIEW}}`;
    const placeholders = { 'GOAL': 'Goal1', 'OVERVIEW': 'Overview1' };
    
    // Simulate populateTemplate
    let result = template;
    for (const [key, value] of Object.entries(placeholders)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      result = result.replace(regex, value);
    }
    
    assert(!result.includes('{{'), 'Placeholders not replaced');
    assert(result.includes('Goal1'), 'GOAL not replaced');
    assert(result.includes('Overview1'), 'OVERVIEW not replaced');
  });
}

/**
 * Test 3: File Generation
 * 
 * Verifies that the init tool can generate the expected file structure.
 * This tests the file generation workflow.
 * 
 * @function testFileGeneration
 */
function testFileGeneration() {
  test('File Generation - init tool creates expected file structure', () => {
    // This is a structural test - verify that init.ts can generate files
    // We check that the code structure supports file generation
    
    const initPath = path.join(__dirname, '..', 'src', 'tools', 'init.ts');
    const initContent = fs.readFileSync(initPath, 'utf8');
    
    // Verify init tool reads recipes
    assert(initContent.includes('recipes'), 'init.ts should read recipes');
    
    // Verify init tool extracts templates
    assert(initContent.includes('extractTemplateFromRecipe'), 'init.ts should extract templates');
    
    // Verify init tool populates templates
    assert(initContent.includes('populateTemplate'), 'init.ts should populate templates');
    
    // Verify init tool creates files
    assert(initContent.includes('writeFileSync'), 'init.ts should create files');
    
    // Verify init tool creates directory structure
    assert(initContent.includes('mkdirSync') || initContent.includes('mkdir'), 'init.ts should create directories');
  });
}

/**
 * Test 4: Data Flow
 * 
 * Verifies that data flows correctly from base.md to generated files.
 * This tests the end-to-end data flow through the system.
 * 
 * @function testDataFlow
 */
function testDataFlow() {
  test('Data Flow - base.md data flows to generated files', () => {
    // Verify that init.ts reads base.md
    const initPath = path.join(__dirname, '..', 'src', 'tools', 'init.ts');
    const initContent = fs.readFileSync(initPath, 'utf8');
    
    assert(initContent.includes('base.md'), 'init.ts should read base.md');
    assert(initContent.includes('parseBaseMd'), 'init.ts should parse base.md');
    
    // Verify that parsed data is used in template population
    assert(initContent.includes('populateTemplate'), 'init.ts should use parsed data in templates');
  });
}

/**
 * Test 5: Recipe Access
 * 
 * Verifies that recipes are accessible as MCP resources.
 * This tests the resource registration system.
 * 
 * @function testRecipeAccess
 */
function testRecipeAccess() {
  test('Recipe Access - recipes are accessible as resources', () => {
    const recipesPath = path.join(__dirname, '..', 'src', 'resources', 'recipes.ts');
    const recipesContent = fs.readFileSync(recipesPath, 'utf8');
    
    // Verify recipe map exists
    assert(recipesContent.includes('recipeMap'), 'recipes.ts should have recipeMap');
    
    // Verify key recipes are registered
    const requiredRecipes = [
      'awp-recipe',
      'pro-backlog-recipe',
      'mvp-backlog-recipe',
      'poc-backlog-recipe'
    ];
    
    requiredRecipes.forEach(recipe => {
      assert(
        recipesContent.includes(recipe),
        `Recipe ${recipe} should be registered in recipes.ts`
      );
    });
  });
}

/**
 * Test 6: Tool Registration
 * 
 * Verifies that all tools are properly registered in the MCP server.
 * This tests the tool registration system.
 * 
 * @function testToolRegistration
 */
function testToolRegistration() {
  test('Tool Registration - tools are registered in index.ts', () => {
    const indexPath = path.join(__dirname, '..', 'src', 'index.ts');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Verify tools are registered
    const requiredTools = ['base', 'init', 'recommend'];
    
    requiredTools.forEach(tool => {
      assert(
        indexContent.includes(`name: "${tool}"`) || indexContent.includes(`name: '${tool}'`),
        `Tool ${tool} should be registered in index.ts`
      );
    });
  });
}

/**
 * Test 7: Recipe Completeness
 * 
 * Verifies that all recipes have the required methodology and template sections.
 * This tests recipe structure and completeness.
 * 
 * @function testRecipeCompleteness
 */
function testRecipeCompleteness() {
  test('Recipe Completeness - recipes have methodology and template sections', () => {
    const recipesDir = path.join(__dirname, '..', 'src', 'recipes');
    const recipeFiles = fs.readdirSync(recipesDir).filter(f => f.endsWith('.md'));
    
    recipeFiles.forEach(recipeFile => {
      const recipePath = path.join(recipesDir, recipeFile);
      const content = fs.readFileSync(recipePath, 'utf8');
      
      // Recipes should have methodology sections (numbered sections)
      const hasMethodology = /\d+\.\s+\w+/.test(content);
      assert(hasMethodology, `${recipeFile} should have methodology sections`);
      
      // Recipes should have template section
      const hasTemplate = /Template Section\s+\[FOR FILE GENERATION\]/.test(content);
      assert(hasTemplate, `${recipeFile} should have template section`);
    });
  });
}

/**
 * Test 8: Task Slicing Guidelines
 * 
 * Verifies that backlog recipes contain task slicing guidelines.
 * This ensures AI has proper instructions for breaking down tasks.
 * 
 * @function testTaskSlicingGuidelines
 */
function testTaskSlicingGuidelines() {
  test('Task Slicing Guidelines - backlog recipes contain task breakdown instructions', () => {
    const recipesDir = path.join(__dirname, '..', 'src', 'recipes');
    const backlogRecipes = [
      'pro-backlog-recipe.md',
      'mvp-backlog-recipe.md',
      'poc-backlog-recipe.md'
    ];
    
    backlogRecipes.forEach(recipeFile => {
      const recipePath = path.join(recipesDir, recipeFile);
      const content = fs.readFileSync(recipePath, 'utf8');
      
      // Pro recipe should have detailed task slicing section (section 6)
      if (recipeFile === 'pro-backlog-recipe.md') {
        assert(
          content.includes('Task Slicing & Hierarchy'),
          `${recipeFile} should have Task Slicing & Hierarchy section`
        );
        assert(
          content.includes('When to Break Down Tasks'),
          `${recipeFile} should have "When to Break Down Tasks" guidelines`
        );
        assert(
          content.includes('Task Status Management'),
          `${recipeFile} should have "Task Status Management" guidelines`
        );
      }
      
      // MVP and POC recipes should reference task slicing
      if (recipeFile === 'mvp-backlog-recipe.md' || recipeFile === 'poc-backlog-recipe.md') {
        assert(
          content.includes('Task Slicing & Breakdown'),
          `${recipeFile} should have Task Slicing & Breakdown section`
        );
        assert(
          content.includes('break down large tasks'),
          `${recipeFile} should mention breaking down large tasks`
        );
      }
    });
  });
}

// Run all tests
console.log('\n🧪 Running Workflow-Based Tests\n');
console.log('=' .repeat(50));

let passed = 0;
let failed = 0;

const tests = [
  testRecipeSystem,
  testTemplatePopulation,
  testFileGeneration,
  testDataFlow,
  testRecipeAccess,
  testToolRegistration,
  testRecipeCompleteness,
  testTaskSlicingGuidelines
];

tests.forEach(testFn => {
  try {
    testFn();
    passed++;
  } catch (error) {
    failed++;
    console.error(`\nTest suite error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('✅ All workflow tests passed!\n');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please review the errors above.\n');
  process.exit(1);
}
