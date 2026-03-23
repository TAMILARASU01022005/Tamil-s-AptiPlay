import React from 'react';
import { Entity, LevelDef, isValidMove } from '@/features/motion-challenge/gameLogic';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { X } from 'lucide-react';

interface MotionChallengeBoardProps {
    level: LevelDef;
    entities: Entity[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onMove: (id: string, targetX: number, targetY: number) => void;
    disabled?: boolean;
}

const CELL_SIZE = 64; // px

const MotionChallengeBoard: React.FC<MotionChallengeBoardProps> = ({
    level,
    entities,
    selectedId,
    onSelect,
    onMove,
    disabled = false,
}) => {
    const boardWidth = level.cols * CELL_SIZE;
    const boardHeight = level.rows * CELL_SIZE;
    const boardRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className="flex flex-col items-center select-none">
            <div
                ref={boardRef}
                className="relative bg-[#FAECE1]/30 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] rounded-3xl overflow-hidden border-2 border-[#E5DFD3] backdrop-blur-sm"
                style={{ width: boardWidth, height: boardHeight }}
            >
                {/* Render grid lines for visual clarity */}
                {Array.from({ length: level.rows }).map((_, r) => (
                    Array.from({ length: level.cols }).map((_, c) => (
                        <div
                            key={`grid-${r}-${c}`}
                            className="absolute border border-[#E5DFD3]/40"
                            style={{
                                top: r * CELL_SIZE,
                                left: c * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                            }}
                        />
                    ))
                ))}

                {/* Render the Hole */}
                <div
                    className="absolute flex items-center justify-center transition-all duration-300 z-0"
                    style={{
                        top: level.hole.y * CELL_SIZE,
                        left: level.hole.x * CELL_SIZE,
                        width: CELL_SIZE,
                        height: CELL_SIZE,
                    }}
                >
                    <div className="w-[85%] h-[85%] bg-[#1a140f] rounded-full shadow-[inset_0_10px_25px_rgba(0,0,0,0.95)] ring-4 ring-[#E5DFD3]/10" />
                </div>

                {/* Render Entities */}
                {entities.map((entity) => (
                    <EntityComponent
                        key={entity.id}
                        entity={entity}
                        level={level}
                        entities={entities}
                        onMove={onMove}
                        disabled={disabled}
                    />
                ))}
            </div>
        </div>
    );
};

interface EntityComponentProps {
    entity: Entity;
    level: LevelDef;
    entities: Entity[];
    onMove: (id: string, targetX: number, targetY: number) => void;
    disabled: boolean;
}

const EntityComponent: React.FC<EntityComponentProps> = ({
    entity,
    level,
    entities,
    onMove,
    disabled,
}) => {
    const isObstacle = entity.type === 'obstacle';
    
    // Calculate valid movement ranges
    const getBounds = () => {
        if (isObstacle) return { left: 0, right: 0, top: 0, bottom: 0 };
        
        let left = 0, right = 0, top = 0, bottom = 0;
        
        // Find how many cells we can move in each direction starting from current position
        for (let x = entity.x - 1; x >= 0; x--) {
            if (isValidMove(level, entities, entity.id, x, entity.y)) left++;
            else break;
        }
        for (let x = entity.x + 1; x + entity.w <= level.cols; x++) {
            if (isValidMove(level, entities, entity.id, x, entity.y)) right++;
            else break;
        }
        for (let y = entity.y - 1; y >= 0; y--) {
            if (isValidMove(level, entities, entity.id, entity.x, y)) top++;
            else break;
        }
        for (let y = entity.y + 1; y + entity.h <= level.rows; y++) {
            if (isValidMove(level, entities, entity.id, entity.x, y)) bottom++;
            else break;
        }

        return {
            left: -left * CELL_SIZE,
            right: right * CELL_SIZE,
            top: -top * CELL_SIZE,
            bottom: bottom * CELL_SIZE,
        };
    };

    const bounds = getBounds();

    // Motion values for magnetic snapping
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    
    // Transform the raw drag values into snapped grid coordinates
    const snappedX = useTransform(x, (v: number) => Math.round(v / CELL_SIZE) * CELL_SIZE);
    const snappedY = useTransform(y, (v: number) => Math.round(v / CELL_SIZE) * CELL_SIZE);

    // Entity styling
    let entityClasses = 'absolute flex items-center justify-center';
    let innerContent = null;
    let zIndex = 20;

    if (isObstacle) {
        entityClasses += ' bg-[#EBE5DA] cursor-not-allowed z-10 rounded-[14px] border-b-4 border-[#C2B7A9]';
        innerContent = <X className="text-[#C2B7A9] w-8 h-8 opacity-40" />;
        zIndex = 10;
    } else if (entity.type === 'ball') {
        entityClasses += ` rounded-full ${entity.color} cursor-grab active:cursor-grabbing hover:scale-[1.02] shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-2 border-white/30`;
        zIndex = 40;
    } else if (entity.type === 'block') {
        entityClasses += ` ${entity.color} rounded-[14px] cursor-grab active:cursor-grabbing hover:brightness-105 shadow-[0_8px_16px_rgba(0,0,0,0.25)] border border-white/20 border-b-4 border-black/20`;
        zIndex = 30;
    }

    return (
        <motion.div
            drag={!disabled && !isObstacle}
            dragDirectionLock
            dragConstraints={bounds}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={(_, info) => {
                const dx = Math.round(info.offset.x / CELL_SIZE);
                const dy = Math.round(info.offset.y / CELL_SIZE);
                
                // Reset motion values to 0 IMMEDIATELY to prevent flashback
                x.set(0);
                y.set(0);

                if (dx !== 0 || dy !== 0) {
                    if (Math.abs(dx) >= Math.abs(dy)) {
                        onMove(entity.id, entity.x + dx, entity.y);
                    } else {
                        onMove(entity.id, entity.x, entity.y + dy);
                    }
                }
            }}
            animate={{
                top: entity.y * CELL_SIZE,
                left: entity.x * CELL_SIZE,
                width: entity.w * CELL_SIZE,
                height: entity.h * CELL_SIZE,
                zIndex: zIndex
            }}
            // Use zero duration for position to prevent "flashback" flyovers
            // Use subtle spring for width/height/zIndex for polish
            transition={{
                top: { duration: 0 },
                left: { duration: 0 },
                width: { type: 'spring', stiffness: 500, damping: 40 },
                height: { type: 'spring', stiffness: 500, damping: 40 },
                zIndex: { duration: 0.2 }
            }}
            // Link the motion values to the style
            style={{
                x: snappedX,
                y: snappedY,
                padding: entity.type === 'ball' ? '6px' : '3px',
                backgroundClip: 'content-box',
            }}
            className={entityClasses}
        >
            {innerContent}
            {(entity.type === 'ball' || entity.type === 'block') && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/35 to-transparent pointer-events-none rounded-inherit" style={{ borderRadius: 'inherit' }} />
            )}
        </motion.div>
    );
};

export default MotionChallengeBoard;
