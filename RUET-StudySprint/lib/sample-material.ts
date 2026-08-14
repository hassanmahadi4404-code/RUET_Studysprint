export const SAMPLE_TITLE = "CSE 3201 · Operating Systems";

export const SAMPLE_MATERIAL = `
RUET CSE 3201 — Operating Systems: Process Management (Demo Notes)

A process is a program in execution. A process has a process state, program counter, CPU registers,
memory space and resources. Common process states are New, Ready, Running, Waiting (Blocked), and
Terminated. The operating system stores information about each process in a Process Control Block (PCB).
The PCB contains the process ID, state, program counter, registers, scheduling information, memory
management information, accounting information and I/O status.

Context switch: When the CPU switches from one process to another, the OS saves the current process state
in its PCB and restores the saved state of the next process. Context switching is overhead because the
system does no useful user work while switching. Its cost depends on hardware support and the amount of
state that must be saved.

CPU scheduling selects a process from the ready queue. Scheduling goals include high CPU utilization and
throughput, and low turnaround time, waiting time and response time. Turnaround time is completion time
minus arrival time. Waiting time is the total time spent in the ready queue. Response time is the time from
submission until the first response.

First-Come, First-Served (FCFS) is non-preemptive and simple, but a long process can delay every short
process (the convoy effect). Shortest Job First (SJF) chooses the smallest next CPU burst and gives the
minimum average waiting time when burst lengths are known. Its preemptive form is Shortest Remaining Time
First (SRTF). Priority scheduling runs the highest-priority process, but low-priority processes may starve.
Aging gradually increases the priority of waiting processes to prevent starvation.

Round Robin (RR) is preemptive. Each ready process receives a time quantum. A very large quantum makes RR
similar to FCFS; a very small quantum improves responsiveness but creates excessive context-switch overhead.

Deadlock occurs when a set of processes wait forever for resources held by one another. Four necessary
conditions must hold simultaneously: mutual exclusion, hold and wait, no preemption, and circular wait.
Deadlock prevention breaks at least one condition. Avoidance, such as the Banker's algorithm, keeps the
system in a safe state. Detection allows deadlock and later identifies it; recovery may terminate processes
or preempt resources.

Exam focus: distinguish waiting, turnaround and response time; draw Gantt charts for FCFS, SJF/SRTF and RR;
explain starvation versus deadlock; list the four deadlock conditions; and discuss the time-quantum tradeoff.
`;
