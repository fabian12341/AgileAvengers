-- Insert Teams
INSERT INTO Teams (name) VALUES
('Team Alpha'),
('Team Beta'),
('Team Gamma');

-- Insert Users (Employees)
INSERT INTO Users (name, role, email, password, id_team) VALUES
('John Doe', 'Admin', 'john.doe@company.com', 'password123', 1),
('Jane Smith', 'TeamLeader', 'jane.smith@company.com', 'password123', 1),
('Tom Green', 'Agent', 'tom.green@company.com', 'password123', 1),
('Alice Brown', 'Agent', 'alice.brown@company.com', 'password123', 1),
('Bob White', 'Agent', 'bob.white@company.com', 'password123', 1),
('Mark Black', 'Admin', 'mark.black@company.com', 'password123', 2),
('Sara Blue', 'TeamLeader', 'sara.blue@company.com', 'password123', 2),
('Eve Gray', 'Agent', 'eve.gray@company.com', 'password123', 2),
('Chris Red', 'Agent', 'chris.red@company.com', 'password123', 2),
('David Silver', 'Agent', 'david.silver@company.com', 'password123', 2),
('Ella Gold', 'Admin', 'ella.gold@company.com', 'password123', 3),
('Olivia Purple', 'TeamLeader', 'olivia.purple@company.com', 'password123', 3),
('George Yellow', 'Agent', 'george.yellow@company.com', 'password123', 3),
('Lily Orange', 'Agent', 'lily.orange@company.com', 'password123', 3),
('James Pink', 'Agent', 'james.pink@company.com', 'password123', 3);

-- Insert Clients (Company names)
INSERT INTO Clients (name) VALUES
('Tech Innovations Inc.'),
('Green Solutions Ltd.'),
('Bright Future Co.'),
('NextGen Tech LLC'),
('Smart Solutions GmbH'),
('Clean Energy Corp.'),
('Global Ventures'),
('FastTrack Solutions'),
('Creative Designs Co.'),
('Advanced Systems Inc.'),
('Future Enterprises'),
('EcoWorld LLC'),
('Powerhouse Industries'),
('BlueWave Technologies'),
('Visionary Group'),
('Unified Enterprises'),
('Alpha Technologies'),
('Synergy Solutions'),
('RapidGrowth Corp.'),
('WorldWide Holdings');

-- Insert Projects
INSERT INTO Projects (name, id_client) VALUES
('Project A - Tech Innovations', 1),
('Project B - Green Solutions', 2),
('Project C - Bright Future', 3),
('Project D - NextGen Tech', 4),
('Project E - Smart Solutions', 5),
('Project F - Clean Energy', 6),
('Project G - Global Ventures', 7),
('Project H - FastTrack Solutions', 8),
('Project I - Creative Designs', 9),
('Project J - Advanced Systems', 10),
('Project K - Future Enterprises', 11),
('Project L - EcoWorld', 12),
('Project M - Powerhouse Industries', 13),
('Project N - BlueWave Technologies', 14),
('Project O - Visionary Group', 15),
('Project P - Unified Enterprises', 16),
('Project Q - Alpha Technologies', 17),
('Project R - Synergy Solutions', 18),
('Project S - RapidGrowth', 19),
('Project T - WorldWide Holdings', 20);

-- Insert Emotions
INSERT INTO Emotions (happiness, sadness, anger, neutrality, text_negative, text_sentiment_score, overall_sentiment_score) VALUES
(0.8, 0.1, 0.05, 0.05, 'positive', 0.9, 0.85),
(0.6, 0.3, 0.05, 0.1, 'neutral', 0.7, 0.65),
(0.7, 0.2, 0.05, 0.05, 'positive', 0.8, 0.75),
(0.4, 0.5, 0.1, 0.05, 'negative', 0.3, 0.45),
(0.3, 0.6, 0.1, 0.05, 'negative', 0.4, 0.35),
(0.9, 0.05, 0.05, 0.05, 'positive', 0.95, 0.9),
(0.5, 0.3, 0.1, 0.1, 'neutral', 0.7, 0.65),
(0.7, 0.2, 0.05, 0.05, 'positive', 0.8, 0.75),
(0.3, 0.5, 0.1, 0.1, 'negative', 0.35, 0.4),
(0.6, 0.3, 0.05, 0.1, 'neutral', 0.65, 0.6),
(0.8, 0.1, 0.05, 0.05, 'positive', 0.9, 0.85),
(0.5, 0.3, 0.05, 0.15, 'neutral', 0.7, 0.65),
(0.3, 0.5, 0.1, 0.1, 'negative', 0.35, 0.4),
(0.6, 0.3, 0.05, 0.1, 'neutral', 0.65, 0.6),
(0.8, 0.1, 0.05, 0.05, 'positive', 0.9, 0.85),
(0.6, 0.3, 0.05, 0.1, 'neutral', 0.7, 0.65),
(0.9, 0.05, 0.05, 0.05, 'positive', 0.95, 0.9),
(0.7, 0.2, 0.05, 0.05, 'positive', 0.8, 0.75),
(0.3, 0.5, 0.1, 0.1, 'negative', 0.35, 0.4),
(0.4, 0.5, 0.1, 0.05, 'negative', 0.35, 0.45);

-- Insert 20 Calls (1 for each)
INSERT INTO Calls (date, duration, silence_percentage, id_user, id_client, id_emotions) VALUES
('2025-03-01 08:00:00', 300, 10, 1, 1, 1),
('2025-03-02 09:00:00', 320, 15, 2, 2, 4),
('2025-03-03 10:00:00', 310, 12, 3, 3, 5),
('2025-03-04 11:00:00', 340, 20, 4, 4, 6),
('2025-03-05 12:00:00', 330, 18, 5, 5, 7),
('2025-03-06 13:00:00', 315, 25, 6, 6, 10),
('2025-03-07 14:00:00', 300, 22, 7, 7, 11),
('2025-03-08 15:00:00', 310, 10, 8, 8, 12),
('2025-03-09 16:00:00', 325, 14, 9, 9, 13),
('2025-03-10 17:00:00', 335, 15, 10, 10, 14),
('2025-03-11 18:00:00', 300, 10, 11, 11, 15),
('2025-03-12 19:00:00', 320, 16, 12, 12, 16),
('2025-03-13 20:00:00', 310, 12, 13, 13, 17),
('2025-03-14 21:00:00', 340, 18, 14, 14, 18),
('2025-03-15 22:00:00', 300, 20, 15, 15, 19),
('2025-03-16 23:00:00', 315, 14, 16, 16, 20),
('2025-03-17 08:30:00', 330, 11, 17, 17, 21),
('2025-03-18 09:30:00', 310, 13, 18, 18, 22),
('2025-03-19 10:30:00', 320, 15, 19, 19, 23),
('2025-03-20 11:30:00', 340, 10, 20, 20, 24);

-- Insert Transcripts (assuming random text and language)
INSERT INTO Transcripts (text, language, num_speakers, id_call) VALUES
('Hello, how can I help you today?', 'English', 2, 1),
('I need help with my order.', 'English', 2, 2),
('Can you give me more details?', 'English', 2, 3),
('I am facing an issue with the product.', 'English', 2, 4),
('Let me check the status for you.', 'English', 2, 5),
('What’s the problem with the service?', 'English', 2, 6),
('I have a question about the delivery.', 'English', 2, 7),
('There’s an issue with the payment.', 'English', 2, 8),
('I need more information on your products.', 'English', 2, 9),
('Can you assist with the refund process?', 'English', 2, 10),
('I need technical support for my device.', 'English', 2, 11),
('I’m looking for a new service.', 'English', 2, 12),
('Could you explain how the warranty works?', 'English', 2, 13),
('Can you provide some troubleshooting steps?', 'English', 2, 14),
('I need to speak with a manager.', 'English', 2, 15),
('Let me transfer you to the appropriate department.', 'English', 2, 16),
('I am not happy with the service.', 'English', 2, 17),
('Please hold while I check your information.', 'English', 2, 18),
('I would like to cancel my order.', 'English', 2, 19),
('Can you explain the process to me?', 'English', 2, 20);


-- Insert Emotions data for each call (one overall call and one for each speaker)
INSERT INTO Emotions (happiness, sadness, anger, neutrality, text_negative, text_sentiment_score, overall_sentiment_score) VALUES
-- Call 1
(0.75, 0.05, 0.10, 0.10, 'positive', 0.85, 0.72), -- Overall
(0.70, 0.10, 0.05, 0.15, 'positive', 0.80, 0.74), -- Agent
(0.80, 0.05, 0.05, 0.10, 'positive', 0.90, 0.76), -- Client
-- Call 2
(0.65, 0.10, 0.15, 0.10, 'neutral', 0.70, 0.63), -- Overall
(0.60, 0.15, 0.10, 0.15, 'neutral', 0.65, 0.61), -- Agent
(0.70, 0.10, 0.05, 0.15, 'neutral', 0.75, 0.65), -- Client
-- Call 3
(0.80, 0.05, 0.05, 0.10, 'positive', 0.90, 0.76), -- Overall
(0.85, 0.05, 0.05, 0.05, 'positive', 0.92, 0.80), -- Agent
(0.75, 0.10, 0.05, 0.10, 'positive', 0.87, 0.73), -- Client
-- Call 4
(0.60, 0.20, 0.10, 0.10, 'neutral', 0.65, 0.61), -- Overall
(0.55, 0.25, 0.10, 0.10, 'neutral', 0.60, 0.58), -- Agent
(0.65, 0.15, 0.10, 0.10, 'neutral', 0.70, 0.64), -- Client
-- Call 5
(0.85, 0.05, 0.05, 0.05, 'positive', 0.90, 0.79), -- Overall
(0.90, 0.05, 0.05, 0.00, 'positive', 0.92, 0.82), -- Agent
(0.80, 0.10, 0.05, 0.05, 'positive', 0.87, 0.75), -- Client
-- Call 6
(0.70, 0.15, 0.05, 0.10, 'neutral', 0.75, 0.68), -- Overall
(0.65, 0.20, 0.05, 0.10, 'neutral', 0.70, 0.65), -- Agent
(0.75, 0.10, 0.05, 0.10, 'neutral', 0.80, 0.71), -- Client
-- Call 7
(0.78, 0.08, 0.08, 0.06, 'positive', 0.85, 0.72), -- Overall
(0.80, 0.05, 0.05, 0.10, 'positive', 0.88, 0.76), -- Agent
(0.75, 0.10, 0.05, 0.10, 'positive', 0.82, 0.68), -- Client
-- Call 8
(0.55, 0.20, 0.15, 0.10, 'neutral', 0.60, 0.58), -- Overall
(0.50, 0.25, 0.10, 0.15, 'neutral', 0.55, 0.53), -- Agent
(0.60, 0.15, 0.10, 0.15, 'neutral', 0.65, 0.62), -- Client
-- Call 9
(0.80, 0.05, 0.10, 0.05, 'positive', 0.85, 0.74), -- Overall
(0.75, 0.10, 0.05, 0.10, 'positive', 0.80, 0.72), -- Agent
(0.85, 0.05, 0.05, 0.05, 'positive', 0.90, 0.76), -- Client
-- Call 10
(0.70, 0.10, 0.15, 0.05, 'neutral', 0.65, 0.60), -- Overall
(0.65, 0.15, 0.10, 0.10, 'neutral', 0.70, 0.65), -- Agent
(0.75, 0.05, 0.10, 0.10, 'neutral', 0.80, 0.72), -- Client
-- Call 11
(0.85, 0.05, 0.05, 0.05, 'positive', 0.90, 0.79), -- Overall
(0.88, 0.05, 0.05, 0.02, 'positive', 0.92, 0.83), -- Agent
(0.80, 0.10, 0.05, 0.05, 'positive', 0.86, 0.75), -- Client
-- Call 12
(0.60, 0.15, 0.10, 0.15, 'neutral', 0.65, 0.61), -- Overall
(0.55, 0.20, 0.10, 0.15, 'neutral', 0.60, 0.58), -- Agent
(0.65, 0.10, 0.10, 0.15, 'neutral', 0.70, 0.63), -- Client
-- Call 13
(0.80, 0.05, 0.05, 0.10, 'positive', 0.85, 0.73), -- Overall
(0.75, 0.10, 0.05, 0.10, 'positive', 0.80, 0.72), -- Agent
(0.85, 0.05, 0.05, 0.05, 'positive', 0.90, 0.76), -- Client
-- Call 14
(0.70, 0.10, 0.10, 0.10, 'neutral', 0.70, 0.65), -- Overall
(0.65, 0.15, 0.10, 0.10, 'neutral', 0.70, 0.64), -- Agent
(0.75, 0.05, 0.10, 0.10, 'neutral', 0.80, 0.66), -- Client
-- Call 15
(0.65, 0.15, 0.10, 0.10, 'neutral', 0.70, 0.63), -- Overall
(0.60, 0.20, 0.10, 0.10, 'neutral', 0.65, 0.60), -- Agent
(0.70, 0.10, 0.10, 0.10, 'neutral', 0.75, 0.67), -- Client
-- Call 16
(0.80, 0.05, 0.10, 0.05, 'positive', 0.85, 0.74), -- Overall
(0.75, 0.10, 0.05, 0.10, 'positive', 0.80, 0.72), -- Agent
(0.85, 0.05, 0.05, 0.05, 'positive', 0.90, 0.76), -- Client
-- Call 17
(0.75, 0.10, 0.05, 0.10, 'positive', 0.80, 0.72), -- Overall
(0.70, 0.10, 0.05, 0.15, 'positive', 0.75, 0.69), -- Agent
(0.80, 0.05, 0.05, 0.10, 'positive', 0.85, 0.74), -- Client
-- Call 18
(0.60, 0.20, 0.05, 0.15, 'neutral', 0.65, 0.61), -- Overall
(0.55, 0.25, 0.05, 0.15, 'neutral', 0.60, 0.58), -- Agent
(0.65, 0.15, 0.05, 0.15, 'neutral', 0.70, 0.64), -- Client
-- Call 19
(0.75, 0.10, 0.05, 0.10, 'positive', 0.80, 0.72), -- Overall
(0.70, 0.15, 0.05, 0.10, 'positive', 0.75, 0.71), -- Agent
(0.80, 0.05, 0.05, 0.10, 'positive', 0.85, 0.74), -- Client
-- Call 20
(0.70, 0.10, 0.05, 0.15, 'neutral', 0.75, 0.67), -- Overall
(0.65, 0.15, 0.05, 0.15, 'neutral', 0.70, 0.63), -- Agent
(0.75, 0.05, 0.05, 0.15, 'neutral', 0.80, 0.71); -- Client


-- Insert Speaker_Analysis for each call (2 speakers per call: agent and client)
INSERT INTO Speaker_Analysis (role, id_call, id_emotions) VALUES
-- Call 1
('Agent', 1, 2),
('Client', 1, 3),
-- Call 2
('Agent', 2, 5),
('Client', 2, 6),
-- Call 3
('Agent', 3, 8),
('Client', 3, 9),
-- Call 4
('Agent', 4, 11),
('Client', 4, 12),
-- Call 5
('Agent', 5, 14),
('Client', 5, 15),
-- Call 6
('Agent', 6, 17),
('Client', 6, 18),
-- Call 7
('Agent', 7, 20),
('Client', 7, 21),
-- Call 8
('Agent', 8, 23),
('Client', 8, 24),
-- Call 9
('Agent', 9, 26),
('Client', 9, 27),
-- Call 10
('Agent', 10, 29),
('Client', 10, 30),
-- Call 11
('Agent', 11, 32),
('Client', 11, 33),
-- Call 12
('Agent', 12, 35),
('Client', 12, 36),
-- Call 13
('Agent', 13, 38),
('Client', 13, 39),
-- Call 14
('Agent', 14, 41),
('Client', 14, 42),
-- Call 15
('Agent', 15, 44),
('Client', 15, 45),
-- Call 16
('Agent', 16, 47),
('Client', 16, 48),
-- Call 17
('Agent', 17, 50),
('Client', 17, 51),
-- Call 18
('Agent', 18, 53),
('Client', 18, 54),
-- Call 19
('Agent', 19, 56),
('Client', 19, 57),
-- Call 20
('Agent', 20, 59),
('Client', 20, 60);


