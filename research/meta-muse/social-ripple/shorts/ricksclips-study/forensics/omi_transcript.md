[00:00] Look at these two videos. This one has 29 million views.
[00:04] And it's not a one-off. That channel is brand new, and its last 80 shorts got over 200 million views.
[00:11] The other one? That's mine.
[00:13] And no, it didn't come out of an AI video generator.
[00:15] Claude built it in 3D with code every single frame.
[00:19] In this video, I'll show you exactly how I made this animated short.
[00:23] How I trained Claude on this style frame by frame, what went wrong, and how I fixed it, and how you can get it too.
[00:30] You're going to get all of that for completely free.
[00:33] All right, let's get into it.
[00:35] If you've never seen this type of short, it's this: the characters are 2D, but the world around them is 3D.
[00:41] So, how do you train Claude to make this?
[00:43] First, you need references, a lot of them.
[00:47] I went to the channel and had Claude download the last 20 shorts in this style, the ones that look this good.
[00:51] Now, here's the thing.
[00:52] If you just tell Claude to analyze a video, it won't look at every frame.
[00:56] It grabs a few here and there.
[00:58] But a normal video runs at 30 frames per second, and you've probably seen this style all over your feed.
[01:04] Most of those look trash.
[01:06] The reason is the tiny stuff, micro-animations, a little camera move, a little shading, a little light.
[01:12] That's what makes it feel real.
[01:14] And you only catch that at 30 frames per second.
[01:18] So, that's the main thing I told Claude: watch all of them at 30 frames per second and check everything: the lighting, the contrast, the shadows, the movement, the effects, the cuts, everything.
[01:31] 20 shorts, about 18 minutes of video, over 32,000 frames.
[01:34] And it came back with a rulebook.
[01:36] So, what's the actual workflow behind these shorts?
[01:39] It comes down to three layers: how the script is engineered, how the visuals are constructed, and how Claude measured all of it.
[01:45] First, the script.
[01:47] To decode it, Claude needed the audio.
[01:50] And the first time, YouTube handed it the German dub, classic.
[01:54] So it pulled the original English track and transcribed all 20 itself.
[01:59] And every single one opens like this.
[02:11] A paradox in the very first sentence.
[02:14] No intro, no setup.
[02:16] Then it escalates.
[02:17] Then comes the pivot, where the real reason comes out.
[02:20] Then the payoff, one last line, and the twist lands.
[02:23] And there's a signature move: 14 of the 20 flip into the explanation with the exact same two words.
[02:30] And the delivery is relentless, almost four words a second with basically zero dead air.
[02:37] Second, the visuals.
[02:39] The characters are flat, two-dimensional, but they're lit like they physically exist in that world.
[02:46] They catch the key light and they cast real shadows.
[02:50] The world is real 3D geometry, traced with black ink outlines like a comic book.
[02:56] The colors are heavily saturated, warm highlights, cool blue shadows.
[03:02] And the lighting follows the story: warm and bright while it sets things up, then a deep night blue right as the explanation begins.
[03:10] And the camera almost never cuts.
[03:12] 12 of the 20 have one hard cut or none at all.
[03:16] Instead, the camera physically travels into the next moment.
[03:20] Third, and this is the real secret, how Claude analyzed all of it.
[03:25] It didn't just eyeball it; it wrote its own measuring tool.
[03:29] Every two seconds of video became one contact sheet, 60 frames on a single image, 549 of them.
[03:37] Then it tracked the camera with phase correlation, measuring how far the image shifts frame by frame.
[03:44] It flagged every hard cut, and it measured the brightness, the contrast, and the saturation of every short.
[03:51] That's how it found that in about 80% of the frames, the camera is almost perfectly still, just tiny drifts.
[03:59] So, here's the tip: don't ask Claude what it thinks of a video; make it measure.
[04:04] You can't recreate an opinion; you can recreate a number.
[04:09] So, now I had the whole blueprint.
[04:12] Now, the story.
[04:14] We made the same type of short, but with our own story.
[04:18] Same lighting, same camera, same cuts, same script formula, just our own characters.
[04:24] My first topic was: why time seems to slow down when you're in danger.
[04:30] But while Claude studied the 20, it noticed one of them already covered the exact same experiment with 5.7 million views.
[04:39] So, we threw it out and picked a new story, one the channel had never told: 1831, 74 soldiers march across an iron bridge, all in step, and one end of the bridge drops into the river.
[04:54] Before writing a single word, Claude checked every fact: the date, the number of soldiers, even how deep the river was, two feet.
[05:03] And that turned into the best joke in the whole short.
[05:07] Then it wrote the script with the exact formula from the 20: a paradox in the very first line.
[05:13] Then it builds up, then you see, then the twist.
[05:17] After that, Claude started building.
[05:20] At first, it used Blender, same as my very first test.
[05:24] Before any of this, I asked Claude for a quick 5-second test, just to see the look.
[05:30] Claude designed its own character, a little courier.
[05:34] It grabbed free 3D buildings, made flat cartoon clouds, and matched the camera timing from the channel's frames.
[05:41] There was just one problem: on the third camera push, the camera flew right past the character.
[05:48] So, for the bridge, Claude started in Blender again.
[05:52] It tested the ink lines there and drew the whole cast in code: soldiers, an officer, people from the town, a kid, and a parent.
[06:00] Then I had a hunch: maybe these shorts are made with Three.js?
[06:05] That's 3D built with code right in the browser.
[06:09] Claude checked the frames: flat characters standing in a real 3D world.
[06:14] Three.js can do exactly that.
[06:16] So, it moved everything over, and Remotion turns it into a video, frame by frame.
[06:23] Then it built the world: 37 free 3D models—trees, rocks, flowers, market stalls, a cart, even a windmill.
[06:33] And every texture—the grass, the cobblestones, the roofs, the water—was painted by code.
[06:40] The characters got 14 different faces: laughing, whistling, nervous, shocked.
[06:48] Then the bridge: two towers, iron chains, and a deck 5 meters wide.
[06:55] 74 soldiers march across it, four side by side.
[07:00] Every step makes it bounce, and the bounce keeps growing until it snaps.
[07:07] For the ink lines, Claude wrote its own effect: it finds the edges in the 3D world and draws a black line on them.
[07:15] About an hour after the switch, all 15 shots were working, 2,025 frames.
[07:22] But before rendering any video, Claude checked still frames.
[07:27] Good thing it did: in three shots, the camera was stuck inside a house, the trees were teal, and a chain was right in front of everyone's faces.
[07:37] While Claude was fixing that, I put one of our frames next to the original, and it looked cheap.
[07:44] Here's what I told Claude: the original is colorful, high contrast, it looks premium.
[07:51] Ours looks dull.
[07:53] So go analyze it, frame by frame.
[07:56] Take your time.
[07:58] Use 10 agents if you have to.
[08:00] Just make it as close as you possibly can.
[08:04] And Claude agreed, ours looked cheap.
[08:08] Then it broke down exactly why: the original has black ink lines on the whole 3D world, ours had almost none.
[08:15] Their colors are bold, with long blue shadows and deep darks.
[08:20] Ours were pastel and flat.
[08:22] Their wood and stone look hand-painted.
[08:26] You can see the grain and the dark gaps between the planks.
[08:30] Ours were plain.
[08:32] Their backgrounds are blurry, so your eye goes straight to the character.
[08:37] Ours were mostly sharp.
[08:40] And the characters: theirs have egg-shaped heads and thin little limbs.
[08:46] Ours had perfect circle heads and chunky bodies.
[08:50] They looked like clipart pasted on top.
[08:53] And this is where it gets interesting.
[08:57] I asked for 10 agents, Claude used 12.
[09:02] And it didn't just throw them at the problem, it built a team: seven agents to study the gap, one for color, one for the ink lines, one for light and shadows, one for textures, one for the characters, one for depth and framing, and one for motion, the camera and the characters.
[09:21] Each one put the original frames next to ours and measured the difference.
[09:26] No guessing, real numbers.
[09:29] An eighth agent worked on the sound, then four more agents to rebuild everything, one for the camera, one for the world, one for the characters, and one for the final look.
[09:43] But here's the problem: four agents working on the same project can break each other's work.
[09:50] So Claude gave each one its own copy of the project, and each agent owned its own files.
[09:58] Nobody else could touch them.
[10:01] When they were done, Claude merged everything back, file by file.
[10:06] So here's the tip: when you use a lot of agents, don't just split the jobs, split the files.
[10:13] Then I gave Claude 10 hours.
[10:16] 10 hours to learn this style and make the finished video.
[10:21] Here's what the seven agents found.
[10:24] First, the ink lines: the original has black lines on almost three out of four edges.
[10:31] On ours, the agent found zero.
[10:35] The ink effect was there, but the blur effect ran in the same step and wiped it out.
[10:41] And the blur itself?
[10:43] It was so weak, you couldn't see it anywhere.
[10:47] Next, the camera: ours snapped from one spot to the next in three frames.
[10:54] The original glides over about 23 frames, slow in, slow out.
[11:01] Then the color: the original has no pure black anywhere.
[11:07] Ours went almost black.
[11:10] And at sunset, their shadows are purple, ours were brown.
[11:15] And the characters: their bodies are 3.5 heads tall, ours were under 3.
[11:22] And our arms and legs were five times too thick.
[11:26] But the agents also found something I didn't expect: some of our own notes were wrong.
[11:33] Remember the egg-shaped heads?
[11:35] The agent measured 38 of them.
[11:38] Their heads are actually rounder than ours.
[11:42] Ours were the egg-shaped ones.
[11:45] And remember the measuring tool from the start?
[11:49] It said the camera is almost still 80% of the time.
[11:53] It's not.
[11:55] The camera is moving in 65% of the frames, slowly pushing in.
[12:01] The tool just couldn't see moves that slow.
[12:05] And this is exactly the part other tutorials skip.
[12:09] I found only two other tutorials on this style.
[12:13] One sells it inside an app, $67 a month or $97 for everything.
[12:21] The other one gives you a few prompts, and it says your first results might not look as clean.
[12:28] So, here's how you can get mine.
[12:31] Everything from this video, every rule and every fix, I saved as one skill for Claude, and I'm giving it away fully free on my GitHub.
[12:44] You get the whole repository with 5,000 reference images.
[12:50] The link is in the description.
[12:52] So you don't have to do anything, just install it and start making videos.
[12:58] Everything is already set up, so the output should be as polished as it gets.
[13:05] And I'm going to keep uploading new things there.
[13:08] I'll keep updating it and making it better.
[13:12] And you get all of that for free.
[13:15] And here's one more thing: I'm making a video on it tomorrow, this realistic 3D video.
[13:24] As you can see, I made it.
[13:27] That's my name on it.
[13:29] Here's something wild: pull every blood vessel out of your body and lay them in one straight line.
[13:38] Most people guess it would reach across a football field.
[13:42] Not even close.
[13:44] Your body hides billions of microscopic tubes branching through every muscle, every organ, even your bones.
[13:54] Lay them all out and the line would leave your city, cross entire countries, stretch over oceans, and keep on going.
[14:04] Scientists estimate about 100,000 km.
[14:10] That's enough to wrap around the whole earth roughly two and a half times.
[14:16] Just so you know, I've never seen anything like this made with AI.
[14:23] Other people have made this style with Claude, but not like this.
[14:28] I looked, and I couldn't find a single tutorial that gets this close.
[14:35] If this showed up on your feed, you'd never guess AI touched it.
[14:40] In that video, I'll show you exactly how I made it.
[14:45] How to animate a realistic face with an open-source AI model.
[14:50] How to rig the character for free on your own computer.
[14:55] How to make the world look real.
[14:58] How to cut the render from 7.5 hours to 1 hour.
[15:05] And how to render it smaller, then upscale it so it renders as fast as it gets.
[15:13] You can find the skill and everything in the description.
[15:17] The link to the GitHub repository is right there, completely free.
[15:23] That's all for today.
[15:25] Make sure to subscribe and like.
[15:28] And with this type of workflow, you can pretty much clone any style.
[15:34] Bye.