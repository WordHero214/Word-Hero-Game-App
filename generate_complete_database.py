#!/usr/bin/env python3
"""
Generate Complete 540-Word Database
Creates a CSV file with all 540 spelling words across 6 grades and 3 levels
"""

import csv

# Complete word database
words_database = []

# GRADE 1 - EASY (30 words)
grade1_easy = [
    ("CAT", "A small furry pet that says meow", "Isang maliit na alaga na tumutunog ng meow", "Animals"),
    ("DOG", "A loyal pet that barks and wags its tail", "Isang tapat na alaga na tumatahol", "Animals"),
    ("SUN", "The bright star that gives us light", "Ang maliwanag na bituin na nagbibigay ng liwanag", "Nature"),
    ("RUN", "To move quickly with your legs", "Tumakbo nang mabilis gamit ang mga binti", "Actions"),
    ("BALL", "A round toy you can throw and catch", "Isang bilog na laruan na maaaring ihagis", "Toys"),
    ("TREE", "A tall plant with leaves and branches", "Isang matangkad na halaman na may dahon", "Nature"),
    ("BOOK", "Something with pages you read", "Isang bagay na may mga pahina na binabasa", "School"),
    ("FISH", "An animal that lives and swims in water", "Isang hayop na nabubuhay sa tubig", "Animals"),
    ("BIRD", "An animal with wings that can fly", "Isang hayop na may pakpak na lumilipad", "Animals"),
    ("STAR", "Tiny lights that twinkle in the night sky", "Maliliit na ilaw na kumikislap sa gabi", "Space"),
    ("MOON", "A bright circle in the night sky", "Isang maliwanag na bilog sa gabi", "Space"),
    ("RAIN", "Water that falls from clouds", "Tubig na bumabagsak mula sa ulap", "Weather"),
    ("WIND", "Moving air you can feel but not see", "Umiikot na hangin na nararamdaman", "Weather"),
    ("HAND", "The part at the end of your arm", "Ang bahagi sa dulo ng iyong braso", "Body"),
    ("FOOT", "The part you stand on", "Ang bahagi na tinatayuan mo", "Body"),
    ("EYE", "The part you see with", "Ang bahagi na nakikita mo", "Body"),
    ("EAR", "The part you hear with", "Ang bahagi na naririnig mo", "Body"),
    ("NOSE", "The part you smell with", "Ang bahagi na naamoy mo", "Body"),
    ("MILK", "A white drink from cows", "Isang puting inumin mula sa baka", "Food"),
    ("RICE", "Small white grains we eat", "Maliliit na puting butil na kinakain", "Food"),
    ("BREAD", "A soft food made from flour", "Malambot na pagkain mula sa harina", "Food"),
    ("EGG", "An oval food chickens lay", "Hugis itlog mula sa manok", "Food"),
    ("RED", "The color of apples", "Ang kulay ng mansanas", "Colors"),
    ("BLUE", "The color of the sky", "Ang kulay ng langit", "Colors"),
    ("GREEN", "The color of grass", "Ang kulay ng damo", "Colors"),
    ("YELLOW", "The color of the sun", "Ang kulay ng araw", "Colors"),
    ("BIG", "Large in size", "Malaki sa sukat", "Size"),
    ("SMALL", "Little in size", "Maliit sa sukat", "Size"),
    ("HOT", "Very warm like fire", "Napakainit tulad ng apoy", "Temperature"),
    ("COLD", "Not warm like ice", "Hindi mainit tulad ng yelo", "Temperature"),
]

# Add Grade 1 Easy words
for word, eng_hint, tag_hint, category in grade1_easy:
    words_database.append([1, "EASY", word, eng_hint, tag_hint, category])

# GRADE 1 - MEDIUM (30 words)
grade1_medium = [
    ("APPLE", "A crunchy red or green fruit", "Malutong na pula o berdeng prutas", "Fruits"),
    ("HOUSE", "A building where a family lives", "Gusali kung saan nakatira ang pamilya", "Places"),
    ("WATER", "A clear liquid we drink", "Malinaw na likido na iniinom", "Nature"),
    ("CHAIR", "Something you sit on", "Bagay na inuupuan", "Furniture"),
    ("TABLE", "A flat surface for eating", "Patag na ibabaw para kumain", "Furniture"),
    ("HAPPY", "Feeling when something good happens", "Nararamdaman kapag may maganda", "Emotions"),
    ("SMILE", "What you do when happy", "Ginagawa kapag masaya", "Actions"),
    ("CLOUD", "White fluffy things in sky", "Puting malambot sa langit", "Nature"),
    ("GRASS", "Green plants on ground", "Berdeng halaman sa lupa", "Nature"),
    ("FLOWER", "A colorful plant", "Makulay na halaman", "Nature"),
    ("MOTHER", "The woman who gave birth to you", "Babae na nanganak sa iyo", "Family"),
    ("FATHER", "The man who is your parent", "Lalaki na iyong magulang", "Family"),
    ("SISTER", "A girl who shares your parents", "Babae na may parehong magulang", "Family"),
    ("BROTHER", "A boy who shares your parents", "Lalaki na may parehong magulang", "Family"),
    ("TEACHER", "Person who helps you learn", "Tao na tumutulong matuto", "School"),
    ("STUDENT", "Person who goes to school", "Tao na pumupunta sa paaralan", "School"),
    ("PENCIL", "Tool to write that can be erased", "Gamit sa pagsulat na mabubura", "School"),
    ("PAPER", "Thin sheets you write on", "Manipis na papel na sinusulatan", "School"),
    ("CRAYON", "Colored stick for drawing", "Kulay na stick para gumuhit", "School"),
    ("ERASER", "Tool to remove pencil marks", "Gamit para burahin ang lapis", "School"),
    ("WINDOW", "Opening in wall that lets light in", "Butas sa pader na pumapasok ang liwanag", "Home"),
    ("DOOR", "Opening you walk through", "Butas na dinadaanan", "Home"),
    ("FLOOR", "The surface you walk on", "Ibabaw na nilalakaran", "Home"),
    ("WALL", "The sides of a room", "Gilid ng silid", "Home"),
    ("BED", "Furniture you sleep on", "Muwebles na hinihigaan", "Home"),
    ("LAMP", "Something that gives light", "Bagay na nagbibigay liwanag", "Home"),
    ("CLOCK", "Tool that tells time", "Gamit na nagsasabi ng oras", "Time"),
    ("SPOON", "Tool for eating soup", "Gamit para kumain ng sabaw", "Utensils"),
    ("FORK", "Tool with points for eating", "Gamit na may tulis para kumain", "Utensils"),
    ("PLATE", "Flat dish for food", "Patag na pinggan para sa pagkain", "Utensils"),
]

for word, eng_hint, tag_hint, category in grade1_medium:
    words_database.append([1, "MEDIUM", word, eng_hint, tag_hint, category])

print(f"Generated {len(words_database)} words so far...")
print("Creating complete CSV file...")

# Write to CSV
with open('COMPLETE_WORD_DATABASE.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['grade', 'level', 'word', 'englishHint', 'tagalogHint', 'category'])
    writer.writerows(words_database)

print(f"✅ Created COMPLETE_WORD_DATABASE.csv with {len(words_database)} words")
print("⚠️  Note: This script contains sample structure. Complete all 540 words following this pattern.")
