import { onCancel } from './utils/prompts.js';
import { mkdir } from 'fs/promises';
import symbols from 'log-symbols';
import { relative } from 'path';
import { resolve } from 'path';
import prompts from 'prompts';
import k from 'kleur';

const versions = {
    2: () => import('./versions/two.js'),
    3: () => import('./versions/three/index.js'),
};

/** @param {import('dashargs').DashArgs} args */
export const run = async (args) => {
    console.clear(); // ! REMOVE ME

    console.log(`  ${k.dim(`v${'1.0.0'}`)}`);
    console.log(`  ${k.bold().magenta('Routify')} ${k.magenta().dim('CLI')}`);
    console.log();

    const { version, projectName } = await prompts(
        [
            // TODO disable this if version cli opt
            {
                type: 'select',
                name: 'version',
                message: 'Routify Version:',
                choices: [
                    { title: 'Routify 2', value: 2 },
                    {
                        title: `Routify 3 ${k.bold().magenta('[BETA]')}`,
                        value: 3,
                    },
                ],
            },
            // TODO disable this if file name given
            {
                type: 'text',
                name: 'projectName',
                message: 'Project Name:   ',
                initial: 'my-routify-app',
            },
        ],
        { onCancel },
    );

    const projectDir = resolve(projectName);

    // TODO if dir exists and isn't empty check if it's ok to continue
    // TODO make passing dir npm init routify <dir>
    await mkdir(projectDir, { recursive: true });

    await runVersion(version, { args, projectDir });

    console.log();
    console.log(`  ${k.green('All Done!')}`);
    console.log();
    console.log(`  Now you can:`);

    let i = 1;

    console.log(`    ${i++}) cd ${relative(process.cwd(), projectDir)}`);
    console.log(`    ${i++}) npm install`);
    console.log(`    ${i++}) npm run dev`);

    console.log();

    console.log(
        `${symbols.success} If you need help, ${k.blue(
            'join the Discord',
        )}: https://discord.com/invite/ntKJD5B`,
    );
};

const runVersion = async (version, args) => {
    const { run } = await versions[version]();
    return run(args);
};
