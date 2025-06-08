## TODOS

### Models & API Integration
- [ ] Update Gemini models to show specific day versions (June, May releases)
- [x] Add proper Anthropic API integration (currently using OpenRouter)
- [x] Add DeepSeek direct API support
- [x] Improve OpenRouter integration with all available models
- [x] Add custom OpenRouter model support with user-defined model codes
- [ ] Set default model selection based on user's available API keys
- [ ] Auto-select appropriate model when starting new chat based on provider

### Settings & UI Improvements
- [x] Remake API keys page with better design and validation
- [x] Add support for Anthropic and DeepSeek providers in API keys page
- [x] Add visual status indicators for API key validation
- [x] Add custom model management for OpenRouter
- [ ] Remake roadmap page with actual project roadmap items
- [x] Improve model selection UX in chat interface

### Chat Features
- [ ] Add Chat History Search
- [ ] Add Attachments (Image, PDF)
- [ ] Add History Card View
- [ ] Add Scroll to Bottom Button
- [ ] Improve initial chat experience with smart model defaults

### Technical Infrastructure
- [ ] Dexie - Add Sync across multiple tabs in Dexie
- [ ] Dexie - Add Error Handling
- [ ] Resumeable Stream with redis
- [ ] Better error handling for API failures
- [ ] Rate limiting and usage tracking per provider
