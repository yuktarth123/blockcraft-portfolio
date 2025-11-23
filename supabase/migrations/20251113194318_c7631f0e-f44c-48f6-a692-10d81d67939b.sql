-- Clean up duplicate profile_content (keep the newer one)
DELETE FROM profile_content 
WHERE id = 'eea32275-9160-4fa8-b48f-d85e4c586158';

-- Insert mock projects data
INSERT INTO projects (title, role, description, metrics, tags, color, display_order, is_published) VALUES
('E-commerce Platform Redesign', 'Lead Product Manager', 'Led the complete redesign of the e-commerce platform, resulting in improved user experience and increased conversion rates.', 
 ARRAY['40% increase in conversion rate', '2M+ active users', '99.9% uptime'], 
 ARRAY['Product Strategy', 'User Research', 'A/B Testing'], 
 'bg-primary/10 border-primary', 1, true),
('Mobile App Launch', 'Senior PM', 'Launched mobile-first experience for our platform, managing cross-functional team of 15+ members.', 
 ARRAY['500K+ downloads in first month', '4.8★ rating', '60% mobile traffic'], 
 ARRAY['Mobile Strategy', 'Agile', 'Analytics'], 
 'bg-blue-500/10 border-blue-500', 2, true),
('AI-Powered Recommendations', 'Product Owner', 'Implemented ML-based recommendation engine to personalize user experience and drive engagement.', 
 ARRAY['35% increase in engagement', '25% higher retention', '3x more personalized content'], 
 ARRAY['Machine Learning', 'Data Science', 'Product Analytics'], 
 'bg-purple-500/10 border-purple-500', 3, true);

-- Insert mock web_apps data
INSERT INTO web_apps (name, description, tech, demo_url, github_url, display_order, is_published) VALUES
('Portfolio CMS', 'Full-stack portfolio management system with admin panel and real-time updates', 
 ARRAY['React', 'TypeScript', 'Supabase', 'Tailwind CSS'], 
 'https://example.com/portfolio', 'https://github.com/example/portfolio', 1, true),
('Task Manager Pro', 'Collaborative task management application with team features and analytics', 
 ARRAY['Next.js', 'PostgreSQL', 'Redis', 'Vercel'], 
 'https://example.com/tasks', 'https://github.com/example/tasks', 2, true),
('Analytics Dashboard', 'Real-time analytics dashboard for tracking product metrics and KPIs', 
 ARRAY['React', 'D3.js', 'Node.js', 'MongoDB'], 
 'https://example.com/analytics', NULL, 3, true);

-- Insert mock achievements data
INSERT INTO achievements (title, description, year, xp, icon_type, display_order, is_published) VALUES
('Product Leader Award', 'Recognized as Product Leader of the Year for outstanding contribution to product excellence', 
 '2024', 1000, 'trophy', 1, true),
('Launched 5+ Products', 'Successfully launched and scaled 5 major product initiatives across different domains', 
 '2023', 800, 'rocket', 2, true),
('Certified Scrum Master', 'Achieved Professional Scrum Master certification with distinction', 
 '2022', 500, 'award', 3, true),
('Team Growth Champion', 'Built and scaled product team from 3 to 15 members while maintaining high performance', 
 '2023', 750, 'users', 4, true),
('Innovation Award', 'Won company-wide innovation award for implementing AI-driven features', 
 '2024', 900, 'lightbulb', 5, true);