import React from 'react';
import Sketch from 'react-p5';
import p5Types from 'p5';

// Use a global or ref to persist nodes across renders
let globalNodes: any[] = [];

export const NeuralNetworkBackground: React.FC = () => {
    const canvasRef = React.useRef<p5Types | null>(null);
    const nodesRef = React.useRef<Node[]>([]);
    const linkDist = 180; // Increased for better full-page spiderweb look

    class Node {
        x: number;
        y: number;
        vx: number;
        vy: number;
        p5: p5Types;

        constructor(p5: p5Types) {
            this.p5 = p5;
            this.x = p5.random(p5.width);
            this.y = p5.random(p5.height);
            this.vx = p5.random(-0.4, 0.4);
            this.vy = p5.random(-0.4, 0.4);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > this.p5.width) this.vx *= -1;
            if (this.y < 0 || this.y > this.p5.height) this.vy *= -1;
        }

        draw() {
            // Invisible nodes, just lines for the plexus look
            this.p5.noStroke();
            this.p5.fill(99, 102, 241, 120);
            this.p5.circle(this.x, this.y, 2.5);
        }
    }

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
        canvasRef.current = p5;

        // Initialize nodes if they don't exist
        if (nodesRef.current.length === 0) {
            for (let i = 0; i < 60; i++) { // Increased density
                nodesRef.current.push(new Node(p5));
            }
        }
    };

    const draw = (p5: p5Types) => {
        p5.clear();

        const nodes = nodesRef.current;
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw();

            for (let j = i + 1; j < nodes.length; j++) {
                let d = p5.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                if (d < linkDist) {
                    let alpha = p5.map(d, 0, linkDist, 120, 0); // Higher visibility
                    p5.stroke(99, 102, 241, alpha);
                    p5.strokeWeight(1.2);
                    p5.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                }
            }
        }
    };

    const windowResized = (p5: p5Types) => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };

    return <Sketch setup={setup} draw={draw} windowResized={windowResized} className="fixed inset-0 pointer-events-none z-0" />;
};


export const GenerativeBrain: React.FC = () => {
    let t = 0;

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(300, 300).parent(canvasParentRef);
    };

    const draw = (p5: p5Types) => {
        p5.clear();
        p5.translate(p5.width / 2, p5.height / 2);

        p5.noFill();
        p5.stroke(99, 102, 241); // Indigo
        p5.strokeWeight(1.5);

        for (let i = 0; i < 20; i++) {
            p5.beginShape();
            for (let a = 0; a < p5.TWO_PI; a += 0.1) {
                let r = 50 + 30 * p5.noise(Math.cos(a) + 1, Math.sin(a) + 1, t + i * 0.1);
                let x = r * Math.cos(a);
                let y = r * Math.sin(a);
                p5.vertex(x, y);
            }
            p5.endShape(p5.CLOSE);
        }

        t += 0.01;
    };

    return <Sketch setup={setup} draw={draw} className="w-full h-full" />;
};
export const IndustrialReactorNode: React.FC = () => {
    let t = 0;
    const particles: { x: number, y: number, speed: number, alpha: number, size: number }[] = [];

    const setup = (p5: p5Types, canvasParentRef: Element) => {
        p5.createCanvas(500, 400).parent(canvasParentRef);
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: p5.random(-200, 200),
                y: p5.random(-150, 150),
                speed: p5.random(0.5, 2),
                alpha: p5.random(50, 150),
                size: p5.random(2, 5)
            });
        }
    };

    const draw = (p5: p5Types) => {
        p5.clear();
        p5.translate(p5.width / 2, p5.height / 2);

        // Core Glow
        p5.noStroke();
        for (let i = 10; i > 0; i--) {
            p5.fill(79, 70, 229, 10 - i);
            p5.circle(0, 0, i * 20 + p5.sin(t * 2) * 10);
        }

        // Rotating Industrial Rings
        p5.noFill();
        p5.strokeWeight(1);

        // Inner Ring
        p5.stroke(99, 102, 241, 150);
        p5.push();
        p5.rotate(t);
        for (let i = 0; i < 4; i++) {
            p5.rotate(p5.HALF_PI);
            p5.line(40, 0, 60, 0);
        }
        p5.circle(0, 0, 100);
        p5.pop();

        // Outer Structural Ring
        p5.stroke(139, 92, 246, 80);
        p5.push();
        p5.rotate(-t * 0.5);
        p5.rectMode(p5.CENTER);
        p5.rect(0, 0, 150, 150, 20);

        // Mounting brackets
        for (let i = 0; i < 4; i++) {
            p5.rotate(p5.HALF_PI);
            p5.line(75, -10, 85, -10);
            p5.line(75, 10, 85, 10);
        }
        p5.pop();

        // Hexagonal Energy Field
        p5.stroke(79, 70, 229, 30);
        p5.push();
        p5.rotate(t * 0.2);
        p5.beginShape();
        for (let i = 0; i < 6; i++) {
            let angle = p5.TWO_PI / 6 * i;
            p5.vertex(Math.cos(angle) * 120, Math.sin(angle) * 120);
        }
        p5.endShape(p5.CLOSE);
        p5.pop();

        // Floating Data Particles (Manuscript fragments)
        p5.rectMode(p5.CORNER);
        particles.forEach(p => {
            p.y -= p.speed;
            if (p.y < -200) p.y = 200;

            p5.fill(129, 140, 248, p.alpha);
            p5.noStroke();
            // Look like small glowing rectangles (paper fragments)
            p5.rect(p.x, p.y, p.size * 2, p.size * 3, 1);

            // Connecting line to core if close
            let d = Math.sqrt(p.x * p.x + p.y * p.y);
            if (d < 150) {
                p5.stroke(99, 102, 241, p5.map(d, 0, 150, 40, 0));
                p5.line(p.x, p.y, 0, 0);
            }
        });

        // Periodic "Sync" Pulse
        let pulse = (t % 4) / 4;
        p5.noFill();
        p5.stroke(139, 92, 246, (1 - pulse) * 100);
        p5.circle(0, 0, pulse * 400);

        t += 0.02;
    };

    return <Sketch setup={setup} draw={draw} className="w-full h-full flex items-center justify-center opacity-80" />;
};

export const LivePipelineTerminal: React.FC = () => {
    const [logs, setLogs] = React.useState<string[]>([]);
    const logPool = [
        "PIPELINE_STABLE::GENESIS_CORE",
        "SYNCING_MARKET_SIGNALS...",
        "VECTOR_ASSET_LOCKED",
        "300DPI_RENDER_ENGINE_IDLE",
        "COMPLIANCE_GATE_VERIFIED",
        "ASSET_DEPLOYED_TO_KDP",
        "SENTIMENT_RADAR_SCANNING",
        "GEMINI_1.5_PRO_CONNECTED",
        "INDUSTRIAL_STUDIO_ACTIVE",
        "ZERO_LATENCY_STREAM_LOCKED"
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setLogs(prev => {
                const newLog = `> ${logPool[Math.floor(Math.random() * logPool.length)]}`;
                const next = [newLog, ...prev].slice(0, 6);
                return next;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full font-mono text-[8px] text-indigo-400/60 p-4 space-y-1">
            {logs.map((log, i) => (
                <div key={i} className="flex gap-2 items-center overflow-hidden whitespace-nowrap">
                    <span className="text-indigo-500/80">[{new Date().toLocaleTimeString()}]</span>
                    <span style={{ opacity: 1 - i * 0.15 }}>{log}</span>
                </div>
            ))}
            <div className="flex gap-1 items-center mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
                <span className="text-[7px] text-emerald-500/40 uppercase tracking-widest">System_Health_Optimal</span>
            </div>
        </div>
    );
};
