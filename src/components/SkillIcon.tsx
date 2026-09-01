import type { Skill } from '../lib/data';
import python from '../assets/skills/python.svg?raw';
import cplusplus from '../assets/skills/cplusplus.svg?raw';
import c from '../assets/skills/c.svg?raw';
import javascript from '../assets/skills/javascript.svg?raw';
import openjdk from '../assets/skills/openjdk.svg?raw';
import html5 from '../assets/skills/html5.svg?raw';
import react from '../assets/skills/react.svg?raw';
import flutter from '../assets/skills/flutter.svg?raw';
import postgresql from '../assets/skills/postgresql.svg?raw';
import mongodb from '../assets/skills/mongodb.svg?raw';
import firebase from '../assets/skills/firebase.svg?raw';
import espressif from '../assets/skills/espressif.svg?raw';
import flask from '../assets/skills/flask.svg?raw';

const ICONS: Record<Skill['name'], string> = {
  Python: python,
  'C++': cplusplus,
  C: c,
  JavaScript: javascript,
  Java: openjdk,
  'HTML/CSS': html5,
  React: react,
  'Flutter/Dart': flutter,
  PostgreSQL: postgresql,
  MongoDB: mongodb,
  Firebase: firebase,
  ESP32: espressif,
  Flask: flask,
};

export function SkillIcon({ name }: { name: Skill['name'] }) {
  return <span className="skill-icon-svg" dangerouslySetInnerHTML={{ __html: ICONS[name] }} />;
}
